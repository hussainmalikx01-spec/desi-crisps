"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProcessStage } from "@/lib/story-data";

/**
 * A scroll-scrubbed "journey": one stage crossfades into the next as the
 * user scrolls. Uses CSS `position: sticky` (not GSAP's pin) to hold the
 * visual in place while scrolling through it — sticky is native browser
 * behavior, so it always releases cleanly at the end of the section with
 * no risk of leftover content bleeding into whatever comes next.
 */
export default function ProcessStory({
  eyebrow,
  title,
  stages,
}: {
  eyebrow: string;
  title: string;
  stages: ProcessStage[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndexRef = useRef(0);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    setIsMobile(window.innerWidth < 768);
    setReady(true);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (!ready || reducedMotion || isMobile || !trackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: trackRef.current,
        start: "top top",
        end: "bottom bottom",
        // Exact scroll-tracking (no smoothing lag). A numeric scrub value
        // like 0.6 adds inertia — the animation "catches up" after the
        // user stops scrolling, which reads as a wobble/shake. `true`
        // ties it 1:1 to scroll position with zero lag.
        scrub: true,
        onUpdate: (self) => {
          const raw = self.progress * (stages.length - 1);
          const idx = Math.min(Math.max(0, stages.length - 2), Math.floor(raw));
          const frac = raw - idx;

          // Only actually crossfade during the middle slice of the
          // scroll between two stages — each image stays fully, solely
          // visible for most of its turn. This shortens how long two
          // differently-shaped images overlap on screen, which is what
          // reads as a "shake" during the transition.
          const BLEND_START = 0.4;
          const BLEND_END = 0.6;
          let blend = 0;
          if (frac <= BLEND_START) blend = 0;
          else if (frac >= BLEND_END) blend = 1;
          else blend = (frac - BLEND_START) / (BLEND_END - BLEND_START);
          blend = blend * blend * (3 - 2 * blend); // smoothstep easing

          imageRefs.current.forEach((el, i) => {
            if (!el) return;
            let opacity = 0;
            if (i === idx) opacity = 1 - blend;
            else if (i === idx + 1) opacity = blend;
            el.style.opacity = String(opacity);
          });

          const nearest = Math.round(raw);
          if (nearest !== lastIndexRef.current) {
            lastIndexRef.current = nearest;
            setActiveIndex(nearest);
          }
        },
      });

      // Images (especially any admin-uploaded ones) can finish loading
      // after ScrollTrigger has already measured the page — if the page
      // height changes post-measurement, the scroll math drifts. This
      // re-measures once everything has settled.
      const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 300);
      window.addEventListener("load", () => ScrollTrigger.refresh());

      return () => {
        clearTimeout(refreshTimer);
        st.kill();
      };
    }, trackRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [ready, reducedMotion, isMobile, stages.length]);

  if (reducedMotion || isMobile || stages.length <= 1) {
    return <MobileReveal eyebrow={eyebrow} title={title} stages={stages} animate={!reducedMotion} />;
  }

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      <div className="mb-6 text-center">
        <p className="font-utility text-xs uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl text-cream md:text-4xl">{title}</h2>
      </div>

      {/* Tall scroll track — its height controls how much scroll distance
          the journey takes. The sticky child below rides along inside it,
          then releases naturally once we reach the bottom of this div. */}
      <div ref={trackRef} className="relative" style={{ height: `${stages.length * 70}vh` }}>
        <div className="sticky top-0 flex h-screen items-center justify-center">
          <div className="grid w-full max-w-4xl grid-cols-[1fr_auto] items-center gap-12">
            <div className="relative aspect-square w-full max-w-md justify-self-end">
              {stages.map((stage, i) => (
                <div
                  key={`${stage.label}-${i}`}
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  className="absolute inset-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <Image src={stage.icon} alt={stage.label} fill className="object-contain" priority={i === 0} />
                </div>
              ))}
            </div>

            <div className="flex flex-col items-start gap-3">
              {stages.map((stage, i) => (
                <div
                  key={`${stage.label}-${i}`}
                  className={`flex items-center gap-3 transition-opacity duration-300 ${
                    i === activeIndex ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      i === activeIndex ? "bg-gold" : "bg-cream-dim/40"
                    }`}
                  />
                  <span className={`font-display text-lg ${i === activeIndex ? "text-cream" : "text-cream-dim"}`}>
                    {stage.label}
                  </span>
                </div>
              ))}
              <p className="mt-2 max-w-[220px] text-sm text-cream-dim">{stages[activeIndex].caption}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileReveal({
  eyebrow,
  title,
  stages,
  animate,
}: {
  eyebrow: string;
  title: string;
  stages: ProcessStage[];
  animate: boolean;
}) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-12 text-center">
        <p className="font-utility text-xs uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl text-cream md:text-4xl">{title}</h2>
      </div>
      <div className="space-y-4">
        {stages.map((stage, i) => (
          <RevealRow key={`${stage.label}-${i}`} stage={stage} animate={animate} />
        ))}
      </div>
    </div>
  );
}

function RevealRow({ stage, animate }: { stage: ProcessStage; animate: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (!animate || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <div
      ref={ref}
      className="flex items-center gap-5 rounded-sm border border-gold/15 bg-ink-card p-4 transition-all duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
      }}
    >
      <div className="relative h-20 w-20 shrink-0">
        <Image src={stage.icon} alt={stage.label} fill className="object-contain" loading="lazy" />
      </div>
      <div>
        <h3 className="font-display text-base text-cream">{stage.label}</h3>
        <p className="mt-1 text-sm text-cream-dim">{stage.caption}</p>
      </div>
    </div>
  );
}
