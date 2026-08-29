import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { images: { take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-cream">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-sm bg-gold px-4 py-2 font-utility text-xs font-semibold uppercase tracking-wide text-ink hover:bg-gold-bright"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-gold/15">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-ink-card text-cream-dim">
            <tr>
              <th className="px-4 py-3 font-utility text-xs uppercase">Name</th>
              <th className="px-4 py-3 font-utility text-xs uppercase">Line</th>
              <th className="px-4 py-3 font-utility text-xs uppercase">Price</th>
              <th className="px-4 py-3 font-utility text-xs uppercase">Stock</th>
              <th className="px-4 py-3 font-utility text-xs uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-ink-card/50">
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.id}`} className="text-cream hover:text-gold-light">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-cream-dim">{p.line}</td>
                <td className="px-4 py-3 text-cream-dim">Rs. {Number(p.price).toFixed(0)}</td>
                <td className="px-4 py-3 text-cream-dim">{p.stock}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-cream-dim">
                  No products yet. Add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PUBLISHED: "bg-green-500/15 text-green-400",
    COMING_SOON: "bg-gold/15 text-gold-light",
    OUT_OF_STOCK: "bg-red-500/15 text-red-400",
    DRAFT: "bg-cream-dim/15 text-cream-dim",
  };
  return (
    <span className={`rounded-sm px-2 py-1 font-utility text-[10px] uppercase tracking-wide ${colors[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}
