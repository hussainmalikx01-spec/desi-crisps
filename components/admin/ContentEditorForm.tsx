"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Field = {
  key: string;
  label: string;
  type: "input" | "textarea";
  rows?: number;
};

export default function ContentEditorForm({
  fields,
  initialValues,
}: {
  fields: Field[];
  initialValues: Record<string, string>;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);

  function update(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const entries = fields.map((f) => ({ key: f.key, value: values[f.key] ?? "" }));
      const res = await fetch("/api/site-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Saved");
      router.refresh();
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 rounded-sm border border-gold/15 bg-ink-card p-5">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="mb-1.5 block font-utility text-xs uppercase tracking-wide text-cream-dim">
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              rows={field.rows ?? 4}
              value={values[field.key] ?? ""}
              onChange={(e) => update(field.key, e.target.value)}
              className="content-input"
            />
          ) : (
            <input
              value={values[field.key] ?? ""}
              onChange={(e) => update(field.key, e.target.value)}
              className="content-input"
            />
          )}
        </div>
      ))}
      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-sm bg-gold px-6 py-2.5 font-utility text-sm font-semibold uppercase tracking-wide text-ink hover:bg-gold-bright disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>

      <style jsx global>{`
        .content-input {
          width: 100%;
          border-radius: 2px;
          border: 1px solid rgba(201, 162, 39, 0.3);
          background: var(--color-ink);
          padding: 0.6rem 0.8rem;
          color: var(--color-cream);
          font-size: 0.875rem;
        }
        .content-input:focus {
          outline: none;
          border-color: var(--color-gold);
        }
      `}</style>
    </div>
  );
}
