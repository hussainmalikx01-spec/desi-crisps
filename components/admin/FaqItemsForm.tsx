"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Plus, GripVertical } from "lucide-react";

type FaqItem = { question: string; answer: string };

export default function FaqItemsForm({ initialItems }: { initialItems: FaqItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<FaqItem[]>(initialItems.length > 0 ? initialItems : [{ question: "", answer: "" }]);
  const [saving, setSaving] = useState(false);

  function updateItem(index: number, field: keyof FaqItem, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, { question: "", answer: "" }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    const cleaned = items.filter((i) => i.question.trim() && i.answer.trim());
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faqItems: cleaned }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setItems(cleaned.length > 0 ? cleaned : [{ question: "", answer: "" }]);
      toast.success("FAQ saved");
      router.refresh();
    } catch {
      toast.error("Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-sm border border-gold/15 bg-ink-card p-4">
          <div className="flex items-start gap-3">
            <GripVertical size={16} className="mt-3 shrink-0 text-cream-dim/40" />
            <div className="flex-1 space-y-2">
              <input
                value={item.question}
                onChange={(e) => updateItem(i, "question", e.target.value)}
                placeholder="Question"
                className="w-full rounded-sm border border-gold/30 bg-ink px-3 py-2 text-sm text-cream placeholder:text-cream-dim/50 focus:border-gold focus:outline-none"
              />
              <textarea
                value={item.answer}
                onChange={(e) => updateItem(i, "answer", e.target.value)}
                placeholder="Answer"
                rows={2}
                className="w-full rounded-sm border border-gold/30 bg-ink px-3 py-2 text-sm text-cream placeholder:text-cream-dim/50 focus:border-gold focus:outline-none"
              />
            </div>
            <button
              onClick={() => removeItem(i)}
              className="mt-2 shrink-0 text-cream-dim hover:text-red-400"
              aria-label="Remove question"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        <button
          onClick={addItem}
          className="flex items-center gap-1.5 rounded-sm border border-gold/40 px-4 py-2 font-utility text-xs uppercase tracking-wide text-cream hover:bg-gold/10"
        >
          <Plus size={14} /> Add Question
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-sm bg-gold px-6 py-2 font-utility text-xs font-semibold uppercase tracking-wide text-ink hover:bg-gold-bright disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save FAQ"}
        </button>
      </div>
    </div>
  );
}
