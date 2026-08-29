"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/components/storefront/CartContext";
import { Button } from "@/components/ui/Button";
import { ShieldCheck } from "lucide-react";

type City = { id: string; name: string; deliveryFee: number | null };
type ShippingSettings = { freeDeliveryThreshold: number; standardShippingFee: number };

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cities, setCities] = useState<City[]>([]);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    freeDeliveryThreshold: 1500,
    standardShippingFee: 150,
  });

  useEffect(() => {
    fetch("/api/delivery-cities")
      .then((r) => r.json())
      .then((data: City[]) => {
        setCities(data);
        if (data.length > 0) setForm((f) => ({ ...f, city: f.city || data[0].name }));
      })
      .catch(() => {});

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) =>
        setShippingSettings({
          freeDeliveryThreshold: data.freeDeliveryThreshold ?? 1500,
          standardShippingFee: data.standardShippingFee ?? 150,
        })
      )
      .catch(() => {});
  }, []);

  const selectedCity = cities.find((c) => c.name === form.city);
  const isFreeDelivery = subtotal >= shippingSettings.freeDeliveryThreshold;
  const shippingFee = isFreeDelivery
    ? 0
    : selectedCity?.deliveryFee ?? shippingSettings.standardShippingFee;
  const total = subtotal + shippingFee;

  function updateField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error?.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, val] of Object.entries(data.error.fieldErrors)) {
            if (Array.isArray(val) && val[0]) fieldErrors[key] = val[0] as string;
          }
          setErrors(fieldErrors);
          toast.error("Please check the highlighted fields.");
        } else {
          toast.error(data.error || "Something went wrong. Please try again.");
        }
        return;
      }

      clearCart();
      router.push(`/order-confirmation/${data.orderId}`);
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-3xl text-cream">Checkout</h1>

      <div className="mt-10 grid gap-12 md:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Full Name" error={errors.name}>
            <input
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="input-field"
            />
          </Field>
          <Field label="Mobile Number" error={errors.phone} hint="e.g. 03001234567">
            <input
              required
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="input-field"
              placeholder="03XXXXXXXXX"
            />
          </Field>
          <Field label="Email (optional)" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="input-field"
            />
          </Field>
          <Field label="Delivery Address" error={errors.address}>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="input-field"
            />
          </Field>
          <Field label="City" error={errors.city}>
            {cities.length > 0 ? (
              <select
                required
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="input-field"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                required
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="input-field"
                placeholder="e.g. Lahore"
              />
            )}
          </Field>
          <Field label="Order Notes (optional)">
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className="input-field"
            />
          </Field>

          <div className="rounded-sm border border-gold/20 bg-ink-card px-4 py-3">
            <p className="flex items-center gap-2 font-utility text-sm text-cream">
              <ShieldCheck size={16} className="text-gold" /> Cash on Delivery
            </p>
            <p className="mt-1 text-xs text-cream-dim">
              Pay in cash when your order arrives. More payment options coming soon.
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Placing Order…" : "Place Order"}
          </Button>
        </form>

        <div className="h-fit rounded-sm border border-gold/15 bg-ink-card p-6">
          <h2 className="font-display text-lg text-cream">Order Summary</h2>
          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm text-cream-dim">
                <span>{item.name} × {item.quantity}</span>
                <span>Rs. {item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-gold/10 pt-4 text-sm">
            <div className="flex justify-between text-cream-dim">
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>
            <div className="flex justify-between text-cream-dim">
              <span>Shipping{selectedCity ? ` (${selectedCity.name})` : ""}</span>
              <span>{isFreeDelivery ? <span className="text-gold-light">FREE</span> : `Rs. ${shippingFee}`}</span>
            </div>
            {!isFreeDelivery && shippingSettings.freeDeliveryThreshold > subtotal && (
              <p className="text-xs text-cream-dim/70">
                Add Rs. {shippingSettings.freeDeliveryThreshold - subtotal} more for free delivery
              </p>
            )}
            <div className="flex justify-between font-display text-base text-cream">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input-field {
          width: 100%;
          border-radius: 2px;
          border: 1px solid rgba(201, 162, 39, 0.3);
          background: var(--color-ink);
          padding: 0.65rem 0.9rem;
          color: var(--color-cream);
          font-size: 0.9rem;
        }
        .input-field:focus {
          outline: none;
          border-color: var(--color-gold);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block font-utility text-xs uppercase tracking-wide text-cream-dim">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-cream-dim/70">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
