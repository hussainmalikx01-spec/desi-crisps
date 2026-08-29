"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImage = { url: string; altText: string | null };

export default function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const gallery = images.length > 0 ? images : [{ url: "/assets/story/chips-v2/07-final-packet.svg", altText: null }];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-sm border border-gold/15 bg-ink-card">
        <Image
          src={gallery[active].url}
          alt={gallery[active].altText ?? productName}
          fill
          className="object-contain p-12"
          priority
        />
      </div>
      {gallery.length > 1 && (
        <div className="mt-4 flex gap-3">
          {gallery.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 overflow-hidden rounded-sm border transition-colors ${
                active === i ? "border-gold" : "border-gold/15 hover:border-gold/40"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img.url} alt="" fill className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
