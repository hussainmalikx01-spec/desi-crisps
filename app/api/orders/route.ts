import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getPaymentProvider } from "@/lib/payment";
import { getSiteSettings } from "@/lib/get-site-settings";
import { notifyAdminNewOrder } from "@/lib/notifications/whatsapp";
import { emailAdminNewOrder, emailCustomerOrderConfirmation } from "@/lib/notifications/email";

// GET /api/orders — admin only, list all orders
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    include: { customer: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

// POST /api/orders — public, called from checkout
export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { success } = rateLimit(`checkout:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!success) {
    return NextResponse.json(
      { error: "Too many order attempts. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, phone, email, address, city, notes, items } = parsed.data;

  // Delivery availability check — a customer can't order to a city the
  // admin hasn't activated. Case-insensitive match since customers may
  // type "lahore" vs "Lahore".
  const matchedCity = await prisma.deliveryCity.findFirst({
    where: { name: { equals: city.trim(), mode: "insensitive" } },
  });
  if (!matchedCity || !matchedCity.active) {
    return NextResponse.json(
      { error: `Sorry, we don't currently deliver to "${city}". Please check available cities.` },
      { status: 400 }
    );
  }

  // Fetch real prices from the DB — never trust prices sent from the client,
  // since those could be tampered with in the browser before submission.
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "One or more products no longer exist." }, { status: 400 });
  }

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || product.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: `${product?.name ?? "A product"} is not currently available.` },
        { status: 400 }
      );
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Not enough stock for ${product.name}. Only ${product.stock} left.` },
        { status: 400 }
      );
    }
  }

  // Sale price (if set) always wins over the regular price.
  function effectivePrice(product: (typeof products)[number]) {
    return product.salePrice ? Number(product.salePrice) : Number(product.price);
  }

  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + effectivePrice(product) * item.quantity;
  }, 0);

  const settings = await getSiteSettings();
  const freeThreshold = settings.freeDeliveryThreshold ?? 1500;
  const baseFee = matchedCity.deliveryFee ?? settings.standardShippingFee ?? 150;
  const shippingFee = subtotal >= freeThreshold ? 0 : baseFee;
  const total = subtotal + shippingFee;

  const order = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.create({
      data: { name, phone, email: email || null, address, city: matchedCity.name },
    });

    const createdOrder = await tx.order.create({
      data: {
        customerId: customer.id,
        subtotal,
        shippingFee,
        total,
        notes,
        paymentMethod: "COD",
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return { productId: item.productId, quantity: item.quantity, unitPrice: effectivePrice(product) };
          }),
        },
      },
      include: { items: { include: { product: true } }, customer: true },
    });

    // Decrement stock for each purchased item.
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return createdOrder;
  });

  // Confirm payment via the pluggable payment layer (COD = auto-confirm).
  const provider = getPaymentProvider(order.paymentMethod);
  await provider.processPayment(order.id, total);
  await prisma.order.update({ where: { id: order.id }, data: { status: "CONFIRMED" } });

  const itemsSummary = order.items.map((i) => `${i.product.name} x${i.quantity}`).join(", ");

  // Fire-and-forget notifications — don't block the response on these.
  notifyAdminNewOrder({ id: order.id, customerName: name, total: total.toFixed(2), itemsSummary }).catch(() => {});
  emailAdminNewOrder({ id: order.id, customerName: name, total: total.toFixed(2), itemsSummary }).catch(() => {});
  if (email) {
    emailCustomerOrderConfirmation(email, order.id, total.toFixed(2)).catch(() => {});
  }

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
