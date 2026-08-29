import { prisma } from "@/lib/prisma";
import { Star } from "lucide-react";
import ReviewForm from "@/components/storefront/ReviewForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Reviews — Desi Crisps" };

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  const avgRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <p className="font-utility text-xs uppercase tracking-[0.3em] text-gold">Reviews</p>
        <h1 className="mt-3 font-display text-4xl text-cream">What people say</h1>
        {avgRating && (
          <p className="mt-3 text-cream-dim">
            {avgRating} average from {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="mt-14 grid gap-12 md:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-cream-dim">No reviews yet — be the first to share your experience.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="rounded-sm border border-gold/10 bg-ink-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? "fill-gold text-gold" : "text-cream-dim/30"} />
                    ))}
                  </div>
                  {review.product && <span className="text-xs text-cream-dim">{review.product.name}</span>}
                </div>
                <p className="mt-3 text-cream-dim">&ldquo;{review.comment}&rdquo;</p>
                <p className="mt-3 font-utility text-xs uppercase tracking-wide text-gold-light">{review.customerName}</p>
              </div>
            ))
          )}
        </div>

        <ReviewForm />
      </div>
    </div>
  );
}
