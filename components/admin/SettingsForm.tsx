"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Settings = {
  logoUrl: string;
  heroImageUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  bannerText: string;
  footerText: string;
  freeDeliveryThreshold: number;
  standardShippingFee: number;
};

export default function SettingsForm({ initialData }: { initialData: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function uploadTo(
    file: File,
    folder: string,
    setLoading: (v: boolean) => void,
    onDone: (url: string) => void
  ) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onDone(data.url);
      toast.success("Uploaded — save to apply site-wide");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("Settings saved");
      router.refresh();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div>
        <label className="mb-2 block font-utility text-xs uppercase tracking-wide text-cream-dim">Logo</label>
        <div className="flex items-center gap-4">
          {form.logoUrl && (
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gold/20">
              <Image src={form.logoUrl} alt="Logo" fill className="object-cover" />
            </div>
          )}
          <label className="cursor-pointer rounded-sm border border-gold/30 px-4 py-2 text-xs uppercase tracking-wide text-cream-dim hover:border-gold hover:text-cream">
            {uploadingLogo ? "Uploading…" : "Replace Logo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingLogo}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadTo(file, "branding", setUploadingLogo, (url) => update("logoUrl", url));
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      <div>
        <label className="mb-2 block font-utility text-xs uppercase tracking-wide text-cream-dim">
          Hero Background Image
        </label>
        <div className="flex items-center gap-4">
          {form.heroImageUrl && (
            <div className="relative h-16 w-28 overflow-hidden rounded-sm border border-gold/20">
              <Image src={form.heroImageUrl} alt="Hero" fill className="object-cover" />
            </div>
          )}
          <label className="cursor-pointer rounded-sm border border-gold/30 px-4 py-2 text-xs uppercase tracking-wide text-cream-dim hover:border-gold hover:text-cream">
            {uploadingHero ? "Uploading…" : form.heroImageUrl ? "Replace Hero Image" : "Upload Hero Image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingHero}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadTo(file, "hero", setUploadingHero, (url) => update("heroImageUrl", url));
                e.target.value = "";
              }}
            />
          </label>
          {form.heroImageUrl && (
            <button
              type="button"
              onClick={() => update("heroImageUrl", "")}
              className="text-xs text-cream-dim hover:text-red-400"
            >
              Remove
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-cream-dim/70">
          If left empty, the homepage hero uses the logo as a subtle background watermark instead.
        </p>
      </div>

      <Field label="Contact Email">
        <input type="email" value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} className="admin-input" />
      </Field>
      <Field label="Contact Phone">
        <input value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} className="admin-input" />
      </Field>
      <Field label="WhatsApp Number" hint="Include country code, e.g. +923001234567">
        <input value={form.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} className="admin-input" />
      </Field>
      <Field label="Instagram URL">
        <input value={form.instagramUrl} onChange={(e) => update("instagramUrl", e.target.value)} className="admin-input" />
      </Field>
      <Field label="Facebook URL">
        <input value={form.facebookUrl} onChange={(e) => update("facebookUrl", e.target.value)} className="admin-input" />
      </Field>
      <Field label="TikTok URL">
        <input value={form.tiktokUrl} onChange={(e) => update("tiktokUrl", e.target.value)} className="admin-input" />
      </Field>
      <Field label="Homepage Banner Text">
        <input value={form.bannerText} onChange={(e) => update("bannerText", e.target.value)} className="admin-input" />
      </Field>
      <Field label="Footer Text">
        <textarea rows={2} value={form.footerText} onChange={(e) => update("footerText", e.target.value)} className="admin-input" />
      </Field>

      <div className="grid grid-cols-1 gap-4 border-t border-gold/10 pt-4 sm:grid-cols-2">
        <Field label="Free Delivery Threshold (Rs.)" hint="Orders at or above this amount get free shipping">
          <input
            type="number"
            value={form.freeDeliveryThreshold}
            onChange={(e) => update("freeDeliveryThreshold", Number(e.target.value))}
            className="admin-input"
          />
        </Field>
        <Field label="Standard Shipping Fee (Rs.)" hint="Used when a city has no custom fee set">
          <input
            type="number"
            value={form.standardShippingFee}
            onChange={(e) => update("standardShippingFee", Number(e.target.value))}
            className="admin-input"
          />
        </Field>
      </div>

      <button type="submit" disabled={saving} className="rounded-sm bg-gold px-6 py-2.5 font-utility text-sm font-semibold uppercase tracking-wide text-ink hover:bg-gold-bright disabled:opacity-50">
        {saving ? "Saving…" : "Save Settings"}
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-utility text-xs uppercase tracking-wide text-cream-dim">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-cream-dim/70">{hint}</p>}
    </div>
  );
}
