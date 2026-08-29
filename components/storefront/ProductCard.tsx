"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  salePrice?: number | string | null;
  featured?: boolean;
  status: "PUBLISHED" | "COMING_SOON" | "OUT_OF_STOCK" | "DRAFT";
  images: { url: string; altText: string | null }[];
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const price = Number(product.price);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;
  const effectivePrice = salePrice ?? price;
  const image = product.images[0]?.url ?? "/assets/story/chips-v2/07-final-packet.svg";
  const isAvailable = product.status === "PUBLISHED";

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({ productId: product.id, name: product.name, slug: product.slug, price: effectivePrice, image });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-sm border border-gold/10 bg-ink-card transition-[transform,box-shadow,border-color] duration-400 ease-out hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-soft">
        <Image
          src={image}
          alt={product.images[0]?.altText ?? product.name}
          fill
          className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.status === "COMING_SOON" && (
            <span className="rounded-sm bg-gold px-2 py-1 font-utility text-[10px] font-semibold uppercase tracking-wide text-ink">
              Coming Soon
            </span>
          )}
          {product.status === "OUT_OF_STOCK" && (
            <span className="rounded-sm bg-cream-dim px-2 py-1 font-utility text-[10px] font-semibold uppercase tracking-wide text-ink">
              Out of Stock
            </span>
          )}
          {salePrice && (
            <span className="rounded-sm bg-red-500/90 px-2 py-1 font-utility text-[10px] font-semibold uppercase tracking-wide text-white">
              Sale
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg text-cream">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="flex items-baseline gap-2">
            <span className="font-utility text-sm text-gold-light">Rs. {effectivePrice.toFixed(0)}</span>
            {salePrice && (
              <span className="font-utility text-xs text-cream-dim/60 line-through">Rs. {price.toFixed(0)}</span>
            )}
          </span>
          {isAvailable && (
            <button
              onClick={handleAddToCart}
              className="font-utility text-xs uppercase tracking-wide text-cream-dim transition-colors hover:text-gold-light"
            >
              Add +
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
