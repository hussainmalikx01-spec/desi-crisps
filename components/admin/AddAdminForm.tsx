"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddAdminForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add admin");
      toast.success(`${form.name} added as admin`);
      setForm({ name: "", email: "", password: "" });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-sm border border-gold/15 bg-ink-card p-5">
      <input
        required
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        className="admin-input"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        className="admin-input"
      />
      <input
        required
        type="password"
        placeholder="Temporary password (min. 8 characters)"
        minLength={8}
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        className="admin-input"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-sm border border-gold/40 px-5 py-2 font-utility text-xs uppercase tracking-wide text-cream hover:bg-gold/10 disabled:opacity-50"
      >
        {loading ? "Adding…" : "Add Admin"}
      </button>
    </form>
  );
}
