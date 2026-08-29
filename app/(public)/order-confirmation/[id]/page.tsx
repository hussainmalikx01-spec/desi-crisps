import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { customer: true, items: { include: { product: true } } },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <CheckCircle2 size={56} className="mx-auto text-gold" />
      <h1 className="mt-6 font-display text-3xl text-cream">Order Confirmed!</h1>
      <p className="mt-3 text-cream-dim">
        Thank you, {order.customer.name}. Your order{" "}
        <span className="font-utility text-gold-light">#{order.id.slice(-6).toUpperCase()}</span> has been placed.
      </p>

      <div className="mt-10 rounded-sm border border-gold/15 bg-ink-card p-6 text-left">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between border-b border-gold/10 py-2 text-sm text-cream-dim last:border-0">
            <span>{item.product.name} × {item.quantity}</span>
            <span>Rs. {(Number(item.unitPrice) * item.quantity).toFixed(0)}</span>
          </div>
        ))}
        <div className="mt-3 flex justify-between font-display text-lg text-cream">
          <span>Total</span>
          <span>Rs. {Number(order.total).toFixed(0)}</span>
        </div>
      </div>

      <p className="mt-6 text-sm text-cream-dim">
        We&apos;ll deliver to: {order.customer.address}, {order.customer.city}
      </p>
      <p className="mt-1 text-sm text-cream-dim">Payment: Cash on Delivery</p>

      <Button href="/shop" className="mt-10">
        Continue Shopping
      </Button>
    </div>
  );
}
