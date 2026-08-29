"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2, Plus, ArrowUp, ArrowDown, RotateCcw } from "lucide-react";

type Stage = {
  id: string;
  line: "CHIPS" | "NIMKO";
  sortOrder: number;
  label: string;
  caption: string;
  imageUrl: string;
  active: boolean;
};

export default function StoryStagesManager({
  line,
  initialStages,
}: {
  line: "CHIPS" | "NIMKO";
  initialStages: Stage[];
}) {
  const router = useRouter();
  const [stages, setStages] = useState(initialStages);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function refresh() {
    router.refresh();
  }

  async function handleAdd() {
    setAdding(true);
    try {
      const res = await fetch("/api/story-stages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          line,
          sortOrder: stages.length,
          label: "New Stage",
          caption: "Describe this stage",
          imageUrl: "/assets/story/chips-v2/07-final-packet.svg",
          active: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to add stage");
      setStages((s) => [...s, data]);
      toast.success("Stage added — edit the details below");
      refresh();
    } catch {
      toast.error("Failed to add stage");
    } finally {
      setAdding(false);
    }
  }

  function updateLocal(id: string, patch: Partial<Stage>) {
    setStages((s) => s.map((stage) => (stage.id === id ? { ...stage, ...patch } : stage)));
  }

  async function saveStage(stage: Stage) {
    setBusyId(stage.id);
    try {
      const res = await fetch(`/api/story-stages/${stage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: stage.label,
          caption: stage.caption,
          active: stage.active,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Saved");
      refresh();
    } catch {
      toast.error("Failed to save");
    } finally {
      setBusyId(null);
    }
  }

  async function handleImageUpload(stage: Stage, file: File) {
    setBusyId(stage.id);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "story");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const patchRes = await fetch(`/api/story-stages/${stage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: data.url }),
      });
      if (!patchRes.ok) throw new Error();

      updateLocal(stage.id, { imageUrl: data.url });
      toast.success("Image updated");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusyId(null);
    }
  }

  async function move(stage: Stage, direction: "up" | "down") {
    const index = stages.findIndex((s) => s.id === stage.id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= stages.length) return;

    const reordered = [...stages];
    [reordered[index], reordered[swapIndex]] = [reordered[swapIndex], reordered[index]];
    setStages(reordered);

    setBusyId(stage.id);
    try {
      await Promise.all(
        reordered.map((s, i) =>
          fetch(`/api/story-stages/${s.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sortOrder: i }),
          })
        )
      );
      refresh();
    } catch {
      toast.error("Failed to reorder");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(stage: Stage) {
    if (!confirm(`Delete "${stage.label}"? This cannot be undone.`)) return;
    setBusyId(stage.id);
    try {
      const res = await fetch(`/api/story-stages/${stage.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setStages((s) => s.filter((st) => st.id !== stage.id));
      toast.success("Stage deleted");
      refresh();
    } catch {
      toast.error("Failed to delete stage");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => (
        <div key={stage.id} className="flex gap-4 rounded-sm border border-gold/15 bg-ink-card p-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-ink">
            <Image src={stage.imageUrl} alt={stage.label} fill className="object-contain p-2" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                value={stage.label}
                onChange={(e) => updateLocal(stage.id, { label: e.target.value })}
                onBlur={() => saveStage(stage)}
                placeholder="Stage title"
                className="rounded-sm border border-gold/30 bg-ink px-2 py-1.5 text-sm text-cream focus:border-gold focus:outline-none"
              />
              <label className="flex cursor-pointer items-center justify-center rounded-sm border border-dashed border-gold/30 text-xs text-cream-dim hover:border-gold">
                {busyId === stage.id ? "…" : "Replace Image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={busyId === stage.id}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(stage, file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            <input
              value={stage.caption}
              onChange={(e) => updateLocal(stage.id, { caption: e.target.value })}
              onBlur={() => saveStage(stage)}
              placeholder="Short description"
              className="w-full rounded-sm border border-gold/30 bg-ink px-2 py-1.5 text-sm text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <button
              onClick={() => move(stage, "up")}
              disabled={i === 0 || busyId === stage.id}
              className="text-cream-dim hover:text-cream disabled:opacity-20"
              aria-label="Move up"
            >
              <ArrowUp size={14} />
            </button>
            <button
              onClick={() => move(stage, "down")}
              disabled={i === stages.length - 1 || busyId === stage.id}
              className="text-cream-dim hover:text-cream disabled:opacity-20"
              aria-label="Move down"
            >
              <ArrowDown size={14} />
            </button>
            <button
              onClick={() => {
                updateLocal(stage.id, { active: !stage.active });
                saveStage({ ...stage, active: !stage.active });
              }}
              className={`mt-1 rounded-sm px-2 py-1 font-utility text-[9px] uppercase tracking-wide ${
                stage.active ? "bg-green-500/15 text-green-400" : "bg-cream-dim/15 text-cream-dim"
              }`}
            >
              {stage.active ? "Active" : "Off"}
            </button>
            <button
              onClick={() => handleDelete(stage)}
              disabled={busyId === stage.id}
              className="mt-1 text-cream-dim hover:text-red-400 disabled:opacity-50"
              aria-label="Delete stage"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      {stages.length === 0 && (
        <p className="rounded-sm border border-dashed border-gold/20 p-6 text-center text-sm text-cream-dim">
          No stages yet for this journey.
        </p>
      )}

      <button
        onClick={handleAdd}
        disabled={adding}
        className="flex items-center gap-1.5 rounded-sm border border-gold/40 px-4 py-2 font-utility text-xs uppercase tracking-wide text-cream hover:bg-gold/10 disabled:opacity-50"
      >
        <Plus size={14} /> Add Stage
      </button>
      <p className="flex items-center gap-1.5 text-xs text-cream-dim/70">
        <RotateCcw size={11} /> Changes save automatically as you edit each field.
      </p>
    </div>
  );
}
