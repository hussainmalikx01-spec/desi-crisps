import Image from "next/image";
import { prisma } from "@/lib/prisma";
import NewsletterForm from "./NewsletterForm";

/**
 * A dedicated, static "Coming Soon" presentation for Nimko — deliberately
 * NOT the multi-stage scroll animation used for the active Chips journey.
 * Nimko isn't launched yet, so it gets a simple, premium single-image
 * banner instead of an animated production journey with empty stages.
 *
 * Uses whichever image the admin most recently uploaded via
 * Admin → Story Images → Nimko Journey as the promotional image.
 */
export default async function NimkoComingSoon() {
  const stage = await prisma.storyStage.findFirst({
    where: { line: "NIMKO", active: true },
    orderBy: { sortOrder: "asc" },
  });

  const image = stage?.imageUrl ?? "/assets/story/nimko-v2/06-final-packet.svg";

  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <p className="font-utility text-xs uppercase tracking-[0.3em] text-gold">Coming Soon</p>
      <h2 className="mt-3 font-display text-3xl text-cream md:text-4xl">Nimko is on its way</h2>
      <p className="mx-auto mt-4 max-w-md text-cream-dim">
        The same honesty and quality behind Desi Crisps, coming to a classic nimko mix. Sign up
        below and we&apos;ll let you know the moment it launches.
      </p>

      <div className="relative mx-auto mt-10 aspect-square w-full max-w-sm overflow-hidden rounded-sm border border-gold/15 bg-ink-card">
        <Image src={image} alt="Nimko — coming soon" fill className="object-contain p-10" />
      </div>

      <div className="mx-auto mt-10 max-w-sm">
        <NewsletterForm />
      </div>
    </section>
  );
}
