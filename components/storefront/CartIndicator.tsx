"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

export default function CartIndicator() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center rounded-full p-2 text-cream transition-colors hover:text-gold-light"
      aria-label={`Cart, ${itemCount} items`}
    >
      <ShoppingBag size={22} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold font-utility text-[11px] font-bold text-ink">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}
