"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, Check, X, Trash2 } from "lucide-react";

type Review = {
  id: string;
  customerName: string;
  comment: string;
  rating: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  productName: string | null;
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gold/15 text-gold-light",
  APPROVED: "bg-green-500/15 text-green-400",
  REJECTED: "bg-red-500/15 text-red-400",
};

export default function ReviewModerationRow({ review }: { review: Review }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: "APPROVED" | "REJECTED") {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Review ${status.toLowerCase()}`);
      router.refresh();
    } catch {
      toast.error("Failed to update review");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this review permanently?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Review deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-sm border border-gold/15 bg-ink-card p-4">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className={i < review.rating ? "fill-gold text-gold" : "text-cream-dim/30"} />
            ))}
          </div>
          <span className={`rounded-sm px-2 py-0.5 font-utility text-[10px] uppercase ${STATUS_COLORS[review.status]}`}>
            {review.status}
          </span>
          {review.productName && <span className="text-xs text-cream-dim">on {review.productName}</span>}
        </div>
        <p className="mt-2 text-sm text-cream-dim">&ldquo;{review.comment}&rdquo;</p>
        <p className="mt-2 font-utility text-xs uppercase tracking-wide text-gold-light">{review.customerName}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        {review.status !== "APPROVED" && (
          <button
            onClick={() => updateStatus("APPROVED")}
            disabled={loading}
            className="rounded-sm border border-green-500/40 p-2 text-green-400 hover:bg-green-500/10 disabled:opacity-50"
            aria-label="Approve"
          >
            <Check size={16} />
          </button>
        )}
        {review.status !== "REJECTED" && (
          <button
            onClick={() => updateStatus("REJECTED")}
            disabled={loading}
            className="rounded-sm border border-gold/30 p-2 text-cream-dim hover:bg-gold/10 disabled:opacity-50"
            aria-label="Reject"
          >
            <X size={16} />
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-sm border border-red-500/40 p-2 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
          aria-label="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
