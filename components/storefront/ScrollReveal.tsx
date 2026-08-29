"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "left" | "right" | "none";

/**
 * The single animation primitive used across the whole storefront for
 * "section enters, then reveals" moments — Hero copy, About split-layout,
 * product grid stagger, testimonials, contact form. One consistent
 * language instead of a different animation technique per section.
 *
 * Deliberately IntersectionObserver + CSS transition, not GSAP ScrollTrigger
 * scrub — this fires ONCE when the element enters view and settles, with
 * no continuous scroll-linked repositioning. That's what keeps it
 * completely immune to the lag/inertia "shake" class of bugs that
 * scrub-based animations are prone to. GSAP is reserved specifically for
 * the deliberate pinned potato-journey animation, where that's the point.
 */
export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 700,
  distance = 28,
  className = "",
  once = true,
}: {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
  }, []);

  useEffect(() => {
    if (reducedMotion || !ref.current) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, once]);

  const initialTransform =
    direction === "up"
      ? `translateY(${distance}px)`
      : direction === "left"
        ? `translateX(-${distance}px)`
        : direction === "right"
          ? `translateX(${distance}px)`
          : "none";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0, 0)" : initialTransform,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
