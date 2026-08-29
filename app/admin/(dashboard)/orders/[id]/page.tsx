import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { customer: true, items: { include: { product: true } } },
  });
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-cream">
          Order #{order.id.slice(-6).toUpperCase()}
        </h1>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>
      <p className="mt-1 text-sm text-cream-dim">
        Placed on {new Date(order.createdAt).toLocaleString()}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-sm border border-gold/15 bg-ink-card p-5">
          <h2 className="font-utility text-xs uppercase tracking-wide text-gold">Customer</h2>
          <p className="mt-3 text-cream">{order.customer.name}</p>
          <p className="mt-1 text-sm text-cream-dim">{order.customer.phone}</p>
          {order.customer.email && <p className="text-sm text-cream-dim">{order.customer.email}</p>}
          <p className="mt-3 text-sm text-cream-dim">
            {order.customer.address}, {order.customer.city}
          </p>
        </div>

        <div className="rounded-sm border border-gold/15 bg-ink-card p-5">
          <h2 className="font-utility text-xs uppercase tracking-wide text-gold">Payment</h2>
          <p className="mt-3 text-cream">Cash on Delivery</p>
          {order.notes && (
            <>
              <h2 className="mt-4 font-utility text-xs uppercase tracking-wide text-gold">Notes</h2>
              <p className="mt-1 text-sm text-cream-dim">{order.notes}</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-sm border border-gold/15 bg-ink-card p-5">
        <h2 className="font-utility text-xs uppercase tracking-wide text-gold">Items</h2>
        <div className="mt-4 divide-y divide-gold/10">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span className="text-cream">
                {item.product.name} × {item.quantity}
              </span>
              <span className="text-cream-dim">Rs. {(Number(item.unitPrice) * item.quantity).toFixed(0)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 border-t border-gold/10 pt-4 text-sm">
          <div className="flex justify-between text-cream-dim">
            <span>Subtotal</span>
            <span>Rs. {Number(order.subtotal).toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-cream-dim">
            <span>Shipping</span>
            <span>Rs. {Number(order.shippingFee).toFixed(0)}</span>
          </div>
          <div className="flex justify-between font-display text-base text-cream">
            <span>Total</span>
            <span>Rs. {Number(order.total).toFixed(0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
