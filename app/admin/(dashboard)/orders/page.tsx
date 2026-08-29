import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma, OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-cream-dim/15 text-cream-dim",
  CONFIRMED: "bg-gold/15 text-gold-light",
  PROCESSING: "bg-blue-500/15 text-blue-400",
  SHIPPED: "bg-purple-500/15 text-purple-400",
  DELIVERED: "bg-green-500/15 text-green-400",
  CANCELLED: "bg-red-500/15 text-red-400",
};

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const where: Prisma.OrderWhereInput = {
    ...(status ? { status: status as OrderStatus } : {}),
    ...(q
      ? {
          OR: [
            { id: { contains: q, mode: "insensitive" } },
            { customer: { name: { contains: q, mode: "insensitive" } } },
            { customer: { phone: { contains: q, mode: "insensitive" } } },
            { customer: { city: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const orders = await prisma.order.findMany({
    where,
    include: { customer: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl text-cream">Orders</h1>

      <form className="mt-6 flex flex-wrap gap-3" method="GET">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by order ID, name, phone, or city..."
          className="flex-1 min-w-[240px] rounded-sm border border-gold/30 bg-ink px-3 py-2 text-sm text-cream placeholder:text-cream-dim/50 focus:border-gold focus:outline-none"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-sm border border-gold/30 bg-ink px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-sm bg-gold px-5 py-2 font-utility text-xs font-semibold uppercase tracking-wide text-ink hover:bg-gold-bright"
        >
          Filter
        </button>
        {(q || status) && (
          <Link
            href="/admin/orders"
            className="rounded-sm border border-gold/30 px-5 py-2 font-utility text-xs uppercase tracking-wide text-cream-dim hover:text-cream"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 overflow-x-auto rounded-sm border border-gold/15">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-ink-card text-cream-dim">
            <tr>
              <th className="px-4 py-3 font-utility text-xs uppercase">Order</th>
              <th className="px-4 py-3 font-utility text-xs uppercase">Customer</th>
              <th className="px-4 py-3 font-utility text-xs uppercase">City</th>
              <th className="px-4 py-3 font-utility text-xs uppercase">Items</th>
              <th className="px-4 py-3 font-utility text-xs uppercase">Total</th>
              <th className="px-4 py-3 font-utility text-xs uppercase">Status</th>
              <th className="px-4 py-3 font-utility text-xs uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-ink-card/50">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-utility text-gold-light hover:underline">
                    #{order.id.slice(-6).toUpperCase()}
                  </Link>
                </td>
                <td className="px-4 py-3 text-cream">{order.customer.name}</td>
                <td className="px-4 py-3 text-cream-dim">{order.customer.city}</td>
                <td className="px-4 py-3 text-cream-dim">{order.items.length} item(s)</td>
                <td className="px-4 py-3 text-cream-dim">Rs. {Number(order.total).toFixed(0)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-sm px-2 py-1 font-utility text-[10px] uppercase tracking-wide ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-cream-dim">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-cream-dim">
                  {q || status ? "No orders match your search." : "No orders yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
