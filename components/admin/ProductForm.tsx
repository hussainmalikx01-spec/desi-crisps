"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type ProductImage = { id: string; url: string };

type ProductFormData = {
  id?: string;
  name: string;
  slug: string;
  line: "CHIPS" | "NIMKO";
  description: string;
  price: string;
  salePrice: string;
  featured: boolean;
  weightGrams: string;
  stock: string;
  status: "PUBLISHED" | "COMING_SOON" | "OUT_OF_STOCK" | "DRAFT";
  ingredients: string;
  nutrition: string;
  images: ProductImage[];
};

export default function ProductForm({ initialData }: { initialData?: Partial<ProductFormData> }) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    line: initialData?.line ?? "CHIPS",
    description: initialData?.description ?? "",
    price: initialData?.price ?? "",
    salePrice: initialData?.salePrice ?? "",
    featured: initialData?.featured ?? false,
    weightGrams: initialData?.weightGrams ?? "",
    stock: initialData?.stock ?? "0",
    status: initialData?.status ?? "DRAFT",
    ingredients: initialData?.ingredients ?? "",
    nutrition: initialData?.nutrition ?? "",
    images: initialData?.images ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function update<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleNameChange(name: string) {
    update("name", name);
    if (!isEdit) {
      update("slug", name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      update("images", [...form.images, { id: data.publicId, url: data.url }]);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(id: string) {
    update("images", form.images.filter((img) => img.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      slug: form.slug,
      line: form.line,
      description: form.description,
      price: form.price,
      salePrice: form.salePrice || null,
      featured: form.featured,
      weightGrams: form.weightGrams || undefined,
      stock: form.stock,
      status: form.status,
      ingredients: form.ingredients || undefined,
      nutrition: form.nutrition || undefined,
      images: form.images.map((img) => ({ url: img.url })),
    };

    try {
      const url = isEdit ? `/api/products/${initialData!.id}` : "/api/products";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.fieldErrors ? "Please check the form fields." : data.error);

      toast.success(isEdit ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEdit || !confirm("Delete this product? This cannot be undone.")) return;
    const res = await fetch(`/api/products/${initialData!.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Product deleted");
      router.push("/admin/products");
      router.refresh();
    } else {
      toast.error("Failed to delete product");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Name">
          <input required value={form.name} onChange={(e) => handleNameChange(e.target.value)} className="admin-input" />
        </FormField>
        <FormField label="Slug">
          <input required value={form.slug} onChange={(e) => update("slug", e.target.value)} className="admin-input" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label="Product Line">
          <select value={form.line} onChange={(e) => update("line", e.target.value as "CHIPS" | "NIMKO")} className="admin-input">
            <option value="CHIPS">Chips</option>
            <option value="NIMKO">Nimko</option>
          </select>
        </FormField>
        <FormField label="Status">
          <select value={form.status} onChange={(e) => update("status", e.target.value as ProductFormData["status"])} className="admin-input">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="COMING_SOON">Coming Soon</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </FormField>
        <FormField label="Weight (grams)">
          <input type="number" value={form.weightGrams} onChange={(e) => update("weightGrams", e.target.value)} className="admin-input" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label="Price (Rs.)">
          <input required type="number" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} className="admin-input" />
        </FormField>
        <FormField label="Sale Price (optional)" hint="Leave blank for no discount">
          <input type="number" step="0.01" value={form.salePrice} onChange={(e) => update("salePrice", e.target.value)} className="admin-input" />
        </FormField>
        <FormField label="Stock">
          <input required type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} className="admin-input" />
        </FormField>
      </div>

      <label className="flex items-center gap-2 text-sm text-cream-dim">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => update("featured", e.target.checked)}
          className="h-4 w-4 rounded border-gold/40 bg-ink accent-[#C9A227]"
        />
        Feature this product on the homepage
      </label>

      <FormField label="Description">
        <textarea required rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} className="admin-input" />
      </FormField>

      <FormField label="Ingredients (optional)">
        <textarea rows={2} value={form.ingredients} onChange={(e) => update("ingredients", e.target.value)} className="admin-input" />
      </FormField>

      <FormField label="Nutrition Info (optional)">
        <textarea rows={2} value={form.nutrition} onChange={(e) => update("nutrition", e.target.value)} className="admin-input" />
      </FormField>

      <FormField label="Product Images">
        <div className="flex flex-wrap gap-3">
          {form.images.map((img) => (
            <div key={img.id} className="relative h-20 w-20 overflow-hidden rounded-sm border border-gold/20">
              <Image src={img.url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute right-0.5 top-0.5 rounded-full bg-ink/80 p-1 text-red-400 hover:bg-ink"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-sm border border-dashed border-gold/30 text-xs text-cream-dim hover:border-gold">
            {uploading ? "…" : "+ Add"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
        </div>
      </FormField>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="rounded-sm bg-gold px-6 py-2.5 font-utility text-sm font-semibold uppercase tracking-wide text-ink hover:bg-gold-bright disabled:opacity-50">
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} className="rounded-sm border border-red-500/40 px-6 py-2.5 font-utility text-sm uppercase tracking-wide text-red-400 hover:bg-red-500/10">
            Delete
          </button>
        )}
      </div>

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

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-utility text-xs uppercase tracking-wide text-cream-dim">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-cream-dim/70">{hint}</p>}
    </div>
  );
}
