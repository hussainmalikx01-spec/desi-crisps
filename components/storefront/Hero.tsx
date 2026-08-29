import Image from "next/image";
import HeroContent from "./HeroContent";
import { getSiteSettings } from "@/lib/get-site-settings";
import { getSiteContent, CONTENT_KEYS } from "@/lib/site-content";

export default async function Hero() {
  const settings = await getSiteSettings();
  const content = await getSiteContent();
  const hasHeroImage = !!settings.heroImageUrl;

  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center">
      {hasHeroImage ? (
        <div className="absolute inset-0">
          <Image src={settings.heroImageUrl} alt="" fill className="object-cover opacity-50" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
        </div>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
            <Image src={settings.logoUrl} alt="" width={900} height={900} className="object-contain" priority />
          </div>
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background: "radial-gradient(circle at 50% 35%, rgba(201,162,39,0.18) 0%, transparent 55%)",
            }}
          />
        </>
      )}

      <HeroContent
        logoUrl={settings.logoUrl}
        eyebrow={content[CONTENT_KEYS.heroEyebrow]}
        headingLine1={content[CONTENT_KEYS.heroHeadingLine1]}
        headingLine2={content[CONTENT_KEYS.heroHeadingLine2]}
        subtext={content[CONTENT_KEYS.heroSubtext]}
      />

      {/* Refined scroll indicator — a line that draws and fades in a slow
          loop, rather than a bouncing dot. Purely decorative + looping, so
          it's disabled under prefers-reduced-motion via the animate-* class
          being conditionally omitted at the CSS level (see globals.css). */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="scroll-line h-10 w-px bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
