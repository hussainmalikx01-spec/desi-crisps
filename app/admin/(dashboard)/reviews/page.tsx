import { prisma } from "@/lib/prisma";
import ReviewModerationRow from "@/components/admin/ReviewModerationRow";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { product: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="font-display text-2xl text-cream">Reviews</h1>
      <p className="mt-1 text-sm text-cream-dim">Approve or reject customer reviews before they appear on the site.</p>

      <div className="mt-6 space-y-3">
        {reviews.length === 0 && <p className="text-cream-dim">No reviews submitted yet.</p>}
        {reviews.map((review) => (
          <ReviewModerationRow
            key={review.id}
            review={{
              id: review.id,
              customerName: review.customerName,
              comment: review.comment,
              rating: review.rating,
              status: review.status,
              productName: review.product?.name ?? null,
              createdAt: review.createdAt.toISOString(),
            }}
          />
        ))}
      </div>
    </div>
  );
}
