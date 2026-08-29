"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import ScrollReveal from "./ScrollReveal";

export default function AboutBlurb() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    if (mql.matches) return;

    // Subtle parallax: the image drifts a little slower than the page
    // scrolls, giving a sense of depth without being disorienting.
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (imageRef.current) {
          const rect = imageRef.current.getBoundingClientRect();
          const viewportCenter = window.innerHeight / 2;
          const distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
          setOffset(distanceFromCenter * -0.06);
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="border-y border-gold/10 bg-ink-soft">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <ScrollReveal direction="left">
          <div ref={imageRef} className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ink-card">
            <div
              style={{
                transform: reducedMotion ? "none" : `translateY(${offset}px)`,
                transition: "transform 0.05s linear",
              }}
              className="absolute inset-0"
            >
              <Image
                src="/assets/story/chips-v2/07-final-packet.svg"
                alt="Desi Crisps packet illustration"
                fill
                className="object-contain p-16 opacity-90"
              />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={120}>
          <div>
            <p className="font-utility text-xs uppercase tracking-[0.3em] text-gold">Our Story</p>
            <h2 className="mt-3 font-display text-3xl text-cream md:text-4xl">
              From the farm to your fingertips
            </h2>
            <p className="mt-6 text-cream-dim">
              Desi Crisps began with a simple idea: snacks should taste like
              they were made at home, with ingredients you&apos;d recognize and
              care you can taste. Every potato is inspected, every batch is
              seasoned by hand, and every packet carries our word — quality
              you can trust.
            </p>
            <div className="mt-8">
              <Button href="/about" variant="outline">
                Read Our Full Story
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
