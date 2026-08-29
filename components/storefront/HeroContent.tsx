"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

/**
 * Cinematic on-load entrance for the Hero — staggered reveal (eyebrow →
 * heading, word by word → subtext → CTAs), fires once on mount since this
 * is above the fold and visible immediately, not scroll-triggered.
 */
export default function HeroContent({
  logoUrl,
  eyebrow,
  headingLine1,
  headingLine2,
  subtext,
}: {
  logoUrl: string;
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  subtext: string;
}) {
  const [stage, setStage] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    if (mql.matches) {
      setStage(4);
      return;
    }
    const timers = [
      setTimeout(() => setStage(1), 100), // logo + eyebrow
      setTimeout(() => setStage(2), 380), // heading words
      setTimeout(() => setStage(3), 950), // subtext
      setTimeout(() => setStage(4), 1150), // CTAs
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const words1 = headingLine1.split(" ");
  const words2 = headingLine2.split(" ");
  const ease = "cubic-bezier(0.16, 1, 0.3, 1)";

  return (
    <div className="relative z-10 flex flex-col items-center">
      <div
        style={{
          opacity: stage >= 1 ? 1 : 0,
          transform: stage >= 1 ? "translateY(0)" : "translateY(14px)",
          transition: `opacity 600ms ${ease}, transform 600ms ${ease}`,
        }}
        className="flex flex-col items-center"
      >
        <Image src={logoUrl} alt="Desi Crisps emblem" width={128} height={128} className="mb-8 rounded-full" priority />
        <p className="font-utility text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      </div>

      <h1 className="mt-4 max-w-3xl overflow-hidden font-display text-5xl font-medium leading-[1.15] text-cream md:text-7xl">
        <span className="block">
          {words1.map((word, i) => (
            <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
              <span
                className="inline-block"
                style={{
                  opacity: stage >= 2 ? 1 : 0,
                  transform: stage >= 2 ? "translateY(0%)" : "translateY(115%)",
                  transition: `opacity 700ms ${ease} ${i * 70}ms, transform 700ms ${ease} ${i * 70}ms`,
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </span>
        <span className="block">
          {words2.map((word, i) => (
            <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
              <span
                className="inline-block"
                style={{
                  opacity: stage >= 2 ? 1 : 0,
                  transform: stage >= 2 ? "translateY(0%)" : "translateY(115%)",
                  transition: `opacity 700ms ${ease} ${(words1.length + i) * 70}ms, transform 700ms ${ease} ${(words1.length + i) * 70}ms`,
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </span>
      </h1>

      <p
        className="mt-6 max-w-xl text-balance font-body text-base text-cream-dim md:text-lg"
        style={{
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? "translateY(0)" : "translateY(10px)",
          transition: `opacity 600ms ${ease}, transform 600ms ${ease}`,
        }}
      >
        {subtext}
      </p>

      <div
        className="mt-10 flex flex-col gap-4 sm:flex-row"
        style={{
          opacity: stage >= 4 ? 1 : 0,
          transform: stage >= 4 ? "translateY(0)" : "translateY(10px)",
          transition: `opacity 600ms ${ease}, transform 600ms ${ease}`,
        }}
      >
        <Button href="/shop">Shop the Range</Button>
        <Button href="/about" variant="outline">
          Our Story
        </Button>
      </div>
    </div>
  );
}
