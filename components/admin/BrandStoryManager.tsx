"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

type Milestone = {
  id: string;
  sortOrder: number;
  title: string;
  description: string;
  imageUrl: string;
  yearLabel: string | null;
  active: boolean;
};

export default function BrandStoryManager({ initialMilestones }: { initialMilestones: Milestone[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialMilestones);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    setAdding(true);
    try {
      const res = await fetch("/api/brand-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sortOrder: items.length,
          title: "New Milestone",
          description: "Describe this moment in the brand's story",
          imageUrl: "/assets/logo/desi-crisps-logo.png",
          yearLabel: "",
          active: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setItems((s) => [...s, data]);
      toast.success("Milestone added — edit the details below");
      router.refresh();
    } catch {
      toast.error("Failed to add milestone");
    } finally {
      setAdding(false);
    }
  }

  function updateLocal(id: string, patch: Partial<Milestone>) {
    setItems((s) => s.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  async function save(milestone: Milestone) {
    setBusyId(milestone.id);
    try {
      const res = await fetch(`/api/brand-story/${milestone.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: milestone.title,
          description: milestone.description,
          yearLabel: milestone.yearLabel || null,
          active: milestone.active,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Saved");
      router.refresh();
    } catch {
      toast.error("Failed to save");
    } finally {
      setBusyId(null);
    }
  }

  async function handleImageUpload(milestone: Milestone, file: File) {
    setBusyId(milestone.id);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "brand-story");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      await fetch(`/api/brand-story/${milestone.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: data.url }),
      });
      updateLocal(milestone.id, { imageUrl: data.url });
      toast.success("Image updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusyId(null);
    }
  }

  async function move(milestone: Milestone, direction: "up" | "down") {
    const index = items.findIndex((m) => m.id === milestone.id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;

    const reordered = [...items];
    [reordered[index], reordered[swapIndex]] = [reordered[swapIndex], reordered[index]];
    setItems(reordered);

    setBusyId(milestone.id);
    try {
      await Promise.all(
        reordered.map((m, i) =>
          fetch(`/api/brand-story/${m.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sortOrder: i }),
          })
        )
      );
      router.refresh();
    } catch {
      toast.error("Failed to reorder");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(milestone: Milestone) {
    if (!confirm(`Delete "${milestone.title}"?`)) return;
    setBusyId(milestone.id);
    try {
      const res = await fetch(`/api/brand-story/${milestone.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((s) => s.filter((m) => m.id !== milestone.id));
      toast.success("Deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-3">
      {items.map((milestone, i) => (
        <div key={milestone.id} className="flex gap-4 rounded-sm border border-gold/15 bg-ink-card p-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-ink">
            <Image src={milestone.imageUrl} alt={milestone.title} fill className="object-contain p-2" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <input
                value={milestone.title}
                onChange={(e) => updateLocal(milestone.id, { title: e.target.value })}
                onBlur={() => save(milestone)}
                placeholder="Title"
                className="col-span-2 rounded-sm border border-gold/30 bg-ink px-2 py-1.5 text-sm text-cream focus:border-gold focus:outline-none"
              />
              <input
                value={milestone.yearLabel ?? ""}
                onChange={(e) => updateLocal(milestone.id, { yearLabel: e.target.value })}
                onBlur={() => save(milestone)}
                placeholder="Year (optional)"
                className="rounded-sm border border-gold/30 bg-ink px-2 py-1.5 text-sm text-cream focus:border-gold focus:outline-none"
              />
            </div>
            <textarea
              value={milestone.description}
              onChange={(e) => updateLocal(milestone.id, { description: e.target.value })}
              onBlur={() => save(milestone)}
              rows={2}
              placeholder="Description"
              className="w-full rounded-sm border border-gold/30 bg-ink px-2 py-1.5 text-sm text-cream focus:border-gold focus:outline-none"
            />
            <label className="inline-flex cursor-pointer items-center rounded-sm border border-dashed border-gold/30 px-3 py-1 text-xs text-cream-dim hover:border-gold">
              {busyId === milestone.id ? "…" : "Replace Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={busyId === milestone.id}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(milestone, file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <button onClick={() => move(milestone, "up")} disabled={i === 0} className="text-cream-dim hover:text-cream disabled:opacity-20" aria-label="Move up">
              <ArrowUp size={14} />
            </button>
            <button onClick={() => move(milestone, "down")} disabled={i === items.length - 1} className="text-cream-dim hover:text-cream disabled:opacity-20" aria-label="Move down">
              <ArrowDown size={14} />
            </button>
            <button
              onClick={() => {
                updateLocal(milestone.id, { active: !milestone.active });
                save({ ...milestone, active: !milestone.active });
              }}
              className={`mt-1 rounded-sm px-2 py-1 font-utility text-[9px] uppercase tracking-wide ${
                milestone.active ? "bg-green-500/15 text-green-400" : "bg-cream-dim/15 text-cream-dim"
              }`}
            >
              {milestone.active ? "Active" : "Off"}
            </button>
            <button onClick={() => handleDelete(milestone)} className="mt-1 text-cream-dim hover:text-red-400" aria-label="Delete">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <p className="rounded-sm border border-dashed border-gold/20 p-6 text-center text-sm text-cream-dim">
          No milestones yet — add your brand's story below.
        </p>
      )}

      <button
        onClick={handleAdd}
        disabled={adding}
        className="flex items-center gap-1.5 rounded-sm border border-gold/40 px-4 py-2 font-utility text-xs uppercase tracking-wide text-cream hover:bg-gold/10 disabled:opacity-50"
      >
        <Plus size={14} /> Add Milestone
      </button>
    </div>
  );
}
