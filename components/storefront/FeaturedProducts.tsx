import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";
import ScrollReveal from "./ScrollReveal";
import { Button } from "@/components/ui/Button";

export default async function FeaturedProducts() {
  // Prefer products the admin has explicitly marked "Featured". If none are
  // marked yet (fresh install), fall back to the latest published products
  // so this section is never empty.
  let products = await prisma.product.findMany({
    where: { status: "PUBLISHED", line: "CHIPS", featured: true },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  if (products.length === 0) {
    products = await prisma.product.findMany({
      where: { status: "PUBLISHED", line: "CHIPS" },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  }

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-utility text-xs uppercase tracking-[0.3em] text-gold">The Range</p>
          <h2 className="mt-3 font-display text-3xl text-cream md:text-4xl">Six flavors, one promise</h2>
        </div>
        <Button href="/shop" variant="ghost" className="hidden md:inline-flex">
          View All →
        </Button>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
        {products.map((product, i) => (
          <ScrollReveal key={product.id} delay={i * 90} duration={600}>
            <ProductCard
              product={{ ...product, price: Number(product.price), salePrice: product.salePrice ? Number(product.salePrice) : null }}
            />
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Button href="/shop" variant="outline">
          View All Products
        </Button>
      </div>
    </section>
  );
}
