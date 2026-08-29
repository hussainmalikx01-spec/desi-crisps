import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductGallery from "@/components/storefront/ProductGallery";
import AddToCartForm from "@/components/storefront/AddToCartForm";
import ProductCard from "@/components/storefront/ProductCard";
import ReviewForm from "@/components/storefront/ReviewForm";
import { ShieldCheck, Truck, BadgeCheck, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product ? `${product.name} — Desi Crisps` : "Product — Desi Crisps" };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      reviews: { where: { status: "APPROVED" }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product || product.status === "DRAFT") notFound();

  const related = await prisma.product.findMany({
    where: { line: product.line, status: "PUBLISHED", NOT: { id: product.id } },
    include: { images: { take: 1 } },
    take: 3,
  });

  const price = Number(product.price);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;
  const effectivePrice = salePrice ?? price;
  const avgRating =
    product.reviews.length > 0
      ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
      : null;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0]?.url,
    offers: {
      "@type": "Offer",
      price: effectivePrice.toFixed(2),
      priceCurrency: "PKR",
      availability:
        product.status === "PUBLISHED" && product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(avgRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating,
        reviewCount: product.reviews.length,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="grid gap-12 md:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <p className="font-utility text-xs uppercase tracking-[0.3em] text-gold">
            {product.line === "CHIPS" ? "Desi Crisps" : "Nimko"}
          </p>
          <h1 className="mt-3 font-display text-4xl text-cream">{product.name}</h1>

          {avgRating && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(Number(avgRating)) ? "fill-gold text-gold" : "text-cream-dim/30"}
                  />
                ))}
              </div>
              <span className="text-xs text-cream-dim">
                {avgRating} ({product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <p className="font-utility text-2xl text-gold-light">Rs. {effectivePrice.toFixed(0)}</p>
            {salePrice && <p className="font-utility text-lg text-cream-dim/60 line-through">Rs. {price.toFixed(0)}</p>}
            {product.weightGrams && <span className="text-sm text-cream-dim">/ {product.weightGrams}g</span>}
          </div>

          <p className="mt-6 leading-relaxed text-cream-dim">{product.description}</p>

          <AddToCartForm
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: effectivePrice,
              image: product.images[0]?.url ?? null,
              status: product.status,
              stock: product.stock,
            }}
          />

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gold/10 pt-6">
            <TrustBadge icon={<ShieldCheck size={18} />} label="Quality Assured" />
            <TrustBadge icon={<Truck size={18} />} label="Fast Delivery" />
            <TrustBadge icon={<BadgeCheck size={18} />} label="Cash on Delivery" />
          </div>

          {(product.ingredients || product.nutrition) && (
            <div className="mt-8 space-y-4 border-t border-gold/10 pt-6">
              {product.ingredients && (
                <div>
                  <h3 className="font-utility text-xs uppercase tracking-wide text-gold">Ingredients</h3>
                  <p className="mt-1 text-sm text-cream-dim">{product.ingredients}</p>
                </div>
              )}
              {product.nutrition && (
                <div>
                  <h3 className="font-utility text-xs uppercase tracking-wide text-gold">Nutrition</h3>
                  <p className="mt-1 text-sm text-cream-dim">{product.nutrition}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reviews for this specific product */}
      <div className="mt-24 border-t border-gold/10 pt-16">
        <h2 className="font-display text-2xl text-cream">Reviews for {product.name}</h2>
        <div className="mt-8 grid gap-12 md:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {product.reviews.length === 0 ? (
              <p className="text-cream-dim">No reviews yet for this product — be the first to share yours.</p>
            ) : (
              product.reviews.map((review) => (
                <div key={review.id} className="rounded-sm border border-gold/10 bg-ink-card p-5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < review.rating ? "fill-gold text-gold" : "text-cream-dim/30"} />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-cream-dim">&ldquo;{review.comment}&rdquo;</p>
                  <p className="mt-3 font-utility text-xs uppercase tracking-wide text-gold-light">
                    {review.customerName}
                  </p>
                </div>
              ))
            )}
          </div>
          <ReviewForm productId={product.id} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="font-display text-2xl text-cream">You might also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={{ ...p, price: Number(p.price), salePrice: p.salePrice ? Number(p.salePrice) : null }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="text-gold">{icon}</span>
      <span className="text-[11px] text-cream-dim">{label}</span>
    </div>
  );
}
