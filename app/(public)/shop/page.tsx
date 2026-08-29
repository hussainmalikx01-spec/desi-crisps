import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/storefront/ProductCard";
import ScrollReveal from "@/components/storefront/ScrollReveal";

export const dynamic = "force-dynamic";

export const metadata = { title: "Shop — Desi Crisps" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ line?: string }>;
}) {
  const { line } = await searchParams;
  const activeLine = line === "NIMKO" ? "NIMKO" : "CHIPS";

  const products = await prisma.product.findMany({
    where: { line: activeLine, status: { in: ["PUBLISHED", "COMING_SOON", "OUT_OF_STOCK"] } },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <p className="font-utility text-xs uppercase tracking-[0.3em] text-gold">Shop</p>
        <h1 className="mt-3 font-display text-4xl text-cream">The Full Range</h1>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <FilterTab label="Chips" href="/shop?line=CHIPS" active={activeLine === "CHIPS"} />
        <FilterTab label="Nimko" href="/shop?line=NIMKO" active={activeLine === "NIMKO"} />
      </div>

      {products.length === 0 ? (
        <div className="mt-20 text-center text-cream-dim">
          <p className="font-display text-2xl text-cream">Nimko is on its way</p>
          <p className="mt-2">We&apos;re perfecting the recipe. Sign up below to be notified first.</p>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {products.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 70} duration={550}>
              <ProductCard product={{ ...product, price: Number(product.price), salePrice: product.salePrice ? Number(product.salePrice) : null }} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterTab({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`rounded-sm border px-5 py-2 font-utility text-xs uppercase tracking-wide transition-colors ${
        active
          ? "border-gold bg-gold text-ink"
          : "border-gold/30 text-cream-dim hover:border-gold hover:text-cream"
      }`}
    >
      {label}
    </a>
  );
}
