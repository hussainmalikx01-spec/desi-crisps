"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      toast.error(res.error.includes("locked") ? res.error : "Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push(searchParams.get("callbackUrl") || "/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Image src="/assets/logo/desi-crisps-logo.png" alt="Desi Crisps" width={64} height={64} />
        </div>
        <h1 className="mt-6 text-center font-display text-2xl text-cream">Admin Login</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block font-utility text-xs uppercase tracking-wide text-cream-dim">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-gold/30 bg-ink-card px-4 py-3 text-cream focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-utility text-xs uppercase tracking-wide text-cream-dim">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-gold/30 bg-ink-card px-4 py-3 text-cream focus:border-gold focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-gold py-3 font-utility text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-gold-bright disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
