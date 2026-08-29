import { prisma } from "@/lib/prisma";
import { Package, ShoppingCart, Clock, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalOrders, pendingOrders, products, revenueAgg, topProducts] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] } },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const topProductDetails = await Promise.all(
    topProducts.map(async (tp) => {
      const product = await prisma.product.findUnique({ where: { id: tp.productId } });
      return { name: product?.name ?? "Unknown", quantity: tp._sum.quantity ?? 0 };
    })
  );

  return (
    <div>
      <h1 className="font-display text-2xl text-cream">Dashboard</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<ShoppingCart size={18} />} label="Total Orders" value={totalOrders} />
        <StatCard icon={<Clock size={18} />} label="Pending Orders" value={pendingOrders} />
        <StatCard icon={<TrendingUp size={18} />} label="Revenue" value={`Rs. ${Number(revenueAgg._sum.total ?? 0).toFixed(0)}`} />
        <StatCard icon={<Package size={18} />} label="Products" value={products} />
      </div>

      <div className="mt-10 rounded-sm border border-gold/15 bg-ink-card p-6">
        <h2 className="font-display text-lg text-cream">Top Products</h2>
        {topProductDetails.length === 0 ? (
          <p className="mt-4 text-sm text-cream-dim">No sales yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {topProductDetails.map((p, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-cream">{p.name}</span>
                <span className="text-cream-dim">{p.quantity} sold</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-sm border border-gold/15 bg-ink-card p-5">
      <div className="flex items-center gap-2 text-gold">{icon}</div>
      <p className="mt-3 font-display text-2xl text-cream">{value}</p>
      <p className="mt-1 text-xs text-cream-dim">{label}</p>
    </div>
  );
}
