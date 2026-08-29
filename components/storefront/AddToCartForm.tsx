"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./CartContext";
import { Button } from "@/components/ui/Button";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  status: "PUBLISHED" | "COMING_SOON" | "OUT_OF_STOCK" | "DRAFT";
  stock: number;
};

export default function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const isAvailable = product.status === "PUBLISHED" && product.stock > 0;

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image,
      },
      quantity
    );
    toast.success(`${quantity} × ${product.name} added to cart`);
  }

  if (product.status === "COMING_SOON") {
    return (
      <div className="mt-8 rounded-sm border border-gold/30 bg-ink-card px-4 py-3 text-sm text-gold-light">
        Coming soon — sign up below to be notified when it launches.
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className="mt-8 rounded-sm border border-cream-dim/20 bg-ink-card px-4 py-3 text-sm text-cream-dim">
        Currently out of stock. Check back soon.
      </div>
    );
  }

  return (
    <div className="mt-8 flex items-center gap-4">
      <div className="flex items-center rounded-sm border border-gold/30">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="p-3 text-cream-dim hover:text-cream"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center font-utility text-cream">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          className="p-3 text-cream-dim hover:text-cream"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
      <Button onClick={handleAdd} className="flex-1">
        Add to Cart
      </Button>
    </div>
  );
}
