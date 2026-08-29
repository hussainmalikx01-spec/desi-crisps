"use client";

/**
 * Next.js re-mounts `template.tsx` on every navigation (unlike layout.tsx,
 * which persists) — that's exactly what a page-transition wrapper needs.
 * Since Header/Footer live in layout.tsx, they sit OUTSIDE this template
 * and never re-animate; only the page content underneath fades in.
 *
 * Pure CSS, no extra animation library — respects prefers-reduced-motion,
 * and because it's a plain opacity/transform animation (not scroll-linked),
 * there's no risk of the jitter/pin-timing bugs scroll-driven animations
 * can have.
 */
export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-transition">
      {children}
      <style jsx global>{`
        @keyframes pageFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .page-transition {
          animation: pageFadeIn 0.4s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .page-transition {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
