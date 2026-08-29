import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ScrollReveal from "./ScrollReveal";

export default async function Testimonials() {
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 9,
  });

  if (reviews.length === 0) return null;

  // Fewer than 4 reviews doesn't give a convincing infinite-loop illusion —
  // fall back to a clean static grid instead of an obviously-short loop.
  const useMarquee = reviews.length >= 4;

  return (
    <section className="py-24">
      <ScrollReveal>
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="font-utility text-xs uppercase tracking-[0.3em] text-gold">What people say</p>
          <h2 className="mt-3 font-display text-3xl text-cream md:text-4xl">Loved by real snackers</h2>
        </div>
      </ScrollReveal>

      {useMarquee ? (
        <div className="marquee-container relative mt-14 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent md:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent md:w-32" />
          <div className="marquee-track flex w-max gap-6 px-6">
            {reviews.map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
            {/* Duplicate set creates the seamless infinite-loop illusion */}
            <div className="marquee-duplicate flex gap-6">
              {reviews.map((review) => (
                <TestimonialCard key={`dup-${review.id}`} review={review} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 px-6 md:grid-cols-3">
          {reviews.map((review, i) => (
            <ScrollReveal key={review.id} delay={i * 100}>
              <TestimonialCard review={review} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}

function TestimonialCard({
  review,
}: {
  review: { id: string; rating: number; comment: string; customerName: string };
}) {
  return (
    <div className="w-80 shrink-0 rounded-sm border border-gold/10 bg-ink-card p-6 md:w-96">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className={i < review.rating ? "fill-gold text-gold" : "text-cream-dim/30"} />
        ))}
      </div>
      <p className="mt-4 text-sm text-cream-dim">&ldquo;{review.comment}&rdquo;</p>
      <p className="mt-4 font-utility text-xs uppercase tracking-wide text-gold-light">{review.customerName}</p>
    </div>
  );
}
