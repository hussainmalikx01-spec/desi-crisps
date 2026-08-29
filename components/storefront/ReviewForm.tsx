"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

export default function ReviewForm({ productId }: { productId?: string }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({ customerName: "", comment: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating, productId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.formErrors?.[0] || "Something went wrong");
      toast.success(data.message);
      setForm({ customerName: "", comment: "" });
      setRating(5);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="h-fit space-y-4 rounded-sm border border-gold/15 bg-ink-card p-6">
      <h2 className="font-display text-lg text-cream">Leave a Review</h2>

      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHoverRating(i + 1)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(i + 1)}
            aria-label={`Rate ${i + 1} stars`}
          >
            <Star size={22} className={i < (hoverRating || rating) ? "fill-gold text-gold" : "text-cream-dim/30"} />
          </button>
        ))}
      </div>

      <input
        required
        placeholder="Your name"
        value={form.customerName}
        onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
        className="w-full rounded-sm border border-gold/30 bg-ink px-3 py-2 text-sm text-cream placeholder:text-cream-dim/50 focus:border-gold focus:outline-none"
      />
      <textarea
        required
        rows={4}
        placeholder="Tell us what you thought..."
        value={form.comment}
        onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
        className="w-full rounded-sm border border-gold/30 bg-ink px-3 py-2 text-sm text-cream placeholder:text-cream-dim/50 focus:border-gold focus:outline-none"
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting…" : "Submit Review"}
      </Button>
      <p className="text-xs text-cream-dim/70">Reviews are moderated before appearing publicly.</p>
    </form>
  );
}
