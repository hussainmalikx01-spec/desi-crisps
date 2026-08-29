import Image from "next/image";
import ProcessStory from "@/components/story/ProcessStory";
import BrandStoryTimeline from "@/components/storefront/BrandStoryTimeline";
import NimkoComingSoon from "@/components/storefront/NimkoComingSoon";
import { getStoryStages } from "@/lib/get-story-stages";
import { getBrandStoryMilestones } from "@/lib/get-brand-story";
import { getSiteContent, CONTENT_KEYS } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata = { title: "Our Story — Desi Crisps" };

export default async function AboutPage() {
  const content = await getSiteContent();
  const [chipsStages, milestones] = await Promise.all([
    getStoryStages("CHIPS"),
    getBrandStoryMilestones(),
  ]);
  return (
    <div>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="font-utility text-xs uppercase tracking-[0.3em] text-gold">
          {content[CONTENT_KEYS.aboutEyebrow]}
        </p>
        <h1 className="mt-3 font-display text-4xl text-cream md:text-5xl">
          {content[CONTENT_KEYS.aboutHeading]}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-cream-dim">
          {content[CONTENT_KEYS.aboutIntro]}
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-sm bg-ink-card">
          <Image
            src="/assets/logo/desi-crisps-logo.png"
            alt="Desi Crisps farmhouse emblem"
            fill
            className="object-contain p-16"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="font-display text-2xl text-cream">{content[CONTENT_KEYS.aboutSection1Title]}</h2>
          <p className="mt-4 text-cream-dim">{content[CONTENT_KEYS.aboutSection1Body]}</p>
          <h2 className="mt-8 font-display text-2xl text-cream">{content[CONTENT_KEYS.aboutSection2Title]}</h2>
          <p className="mt-4 text-cream-dim">{content[CONTENT_KEYS.aboutSection2Body]}</p>
        </div>
      </section>

      {milestones.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-16 text-center">
            <p className="font-utility text-xs uppercase tracking-[0.3em] text-gold">Our Journey</p>
            <h2 className="mt-3 font-display text-3xl text-cream md:text-4xl">Milestones Along the Way</h2>
          </div>
          <BrandStoryTimeline milestones={milestones} />
        </section>
      )}

      <div className="border-t border-gold/10">
        <ProcessStory eyebrow="How it's made" title="From Fresh Potato to Final Packet" stages={chipsStages} />
      </div>
      <div className="border-t border-gold/10">
        <NimkoComingSoon />
      </div>
    </div>
  );
}
