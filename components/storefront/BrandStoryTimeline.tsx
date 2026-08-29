"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Milestone = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  yearLabel: string | null;
};

/**
 * A documentary-style brand timeline, deliberately built differently from
 * the potato-process ProcessStory component:
 * - No scroll-pinning, no GSAP — just IntersectionObserver toggling a
 *   "visible" class per row, animated with a plain CSS transition.
 * - This keeps it lightweight and immune to the pin-timing/jitter issues
 *   that scroll-scrubbed animations are prone to.
 * - Alternating left/right layout gives it a distinct "photo essay" feel
 *   versus the process journey's single-viewport crossfade.
 */
export default function BrandStoryTimeline({ milestones }: { milestones: Milestone[] }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
  }, []);

  if (milestones.length === 0) return null;

  return (
    <div className="space-y-16 md:space-y-24">
      {milestones.map((milestone, i) => (
        <TimelineRow
          key={milestone.id}
          milestone={milestone}
          reverse={i % 2 === 1}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}

function TimelineRow({
  milestone,
  reverse,
  reducedMotion,
}: {
  milestone: Milestone;
  reverse: boolean;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${reverse ? "md:[direction:rtl]" : ""}`}
    >
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ink-card transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)",
        }}
      >
        <Image src={milestone.imageUrl} alt={milestone.title} fill className="object-contain p-10" />
      </div>
      <div
        className="transition-all delay-150 duration-700 ease-out md:[direction:ltr]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        {milestone.yearLabel && (
          <p className="font-utility text-xs uppercase tracking-[0.25em] text-gold">{milestone.yearLabel}</p>
        )}
        <h3 className="mt-2 font-display text-2xl text-cream md:text-3xl">{milestone.title}</h3>
        <p className="mt-4 leading-relaxed text-cream-dim">{milestone.description}</p>
      </div>
    </div>
  );
}
