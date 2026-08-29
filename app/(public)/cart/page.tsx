"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/components/storefront/CartContext";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [shippingSettings, setShippingSettings] = useState({ freeDeliveryThreshold: 1500, standardShippingFee: 150 });

  useEffect(() => {
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

  const isFreeDelivery = subtotal >= shippingSettings.freeDeliveryThreshold;
  // This is an estimate only — the exact fee (which can vary by city) is
  // confirmed on the checkout page once a delivery city is selected.
  const estimatedShipping = isFreeDelivery ? 0 : shippingSettings.standardShippingFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-cream">Your cart is empty</h1>
        <p className="mt-3 text-cream-dim">Add a packet or two — quality you can trust, one crunch at a time.</p>
        <Button href="/shop" className="mt-8">
          Shop the Range
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-3xl text-cream">Your Cart</h1>

      <div className="mt-10 divide-y divide-gold/10">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 py-6">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-gold/15 bg-ink-card">
              <Image
                src={item.image ?? "/assets/story/chips-v2/07-final-packet.svg"}
                alt={item.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="flex-1">
              <Link href={`/product/${item.slug}`} className="font-display text-cream hover:text-gold-light">
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-cream-dim">Rs. {item.price} each</p>
            </div>
            <div className="flex items-center rounded-sm border border-gold/30">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="p-2 text-cream-dim hover:text-cream"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center font-utility text-sm text-cream">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="p-2 text-cream-dim hover:text-cream"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="w-20 text-right font-utility text-gold-light">
              Rs. {item.price * item.quantity}
            </span>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-cream-dim hover:text-red-400"
              aria-label={`Remove ${item.name}`}
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 ml-auto max-w-sm space-y-3 border-t border-gold/10 pt-6">
        <div className="flex justify-between text-sm text-cream-dim">
          <span>Subtotal</span>
          <span>Rs. {subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-cream-dim">
          <span>Estimated Shipping</span>
          <span>{isFreeDelivery ? <span className="text-gold-light">FREE</span> : `Rs. ${estimatedShipping}`}</span>
        </div>
        <div className="flex justify-between border-t border-gold/10 pt-3 font-display text-lg text-cream">
          <span>Estimated Total</span>
          <span>Rs. {subtotal + estimatedShipping}</span>
        </div>
        <Button href="/checkout" className="w-full">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
