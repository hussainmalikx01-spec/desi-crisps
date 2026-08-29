"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");
      toast.success(data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-sm border border-gold/15 bg-ink-card p-5">
      <input
        required
        type="password"
        placeholder="Current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="admin-input"
      />
      <input
        required
        type="password"
        placeholder="New password (min. 8 characters)"
        minLength={8}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="admin-input"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-sm bg-gold px-5 py-2 font-utility text-xs font-semibold uppercase tracking-wide text-ink hover:bg-gold-bright disabled:opacity-50"
      >
        {loading ? "Updating…" : "Update Password"}
      </button>
      <style jsx global>{`
        .admin-input {
          width: 100%;
          border-radius: 2px;
          border: 1px solid rgba(201, 162, 39, 0.3);
          background: var(--color-ink);
          padding: 0.6rem 0.8rem;
          color: var(--color-cream);
          font-size: 0.875rem;
        }
        .admin-input:focus {
          outline: none;
          border-color: var(--color-gold);
        }
      `}</style>
    </form>
  );
}
