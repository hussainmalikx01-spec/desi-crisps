import Hero from "@/components/storefront/Hero";
import ProcessStory from "@/components/story/ProcessStory";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import AboutBlurb from "@/components/storefront/AboutBlurb";
import Testimonials from "@/components/storefront/Testimonials";
import NimkoComingSoon from "@/components/storefront/NimkoComingSoon";
import { getStoryStages } from "@/lib/get-story-stages";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const chipsStages = await getStoryStages("CHIPS");

  return (
    <>
      <Hero />

      <ProcessStory
        eyebrow="How it's made"
        title="From Fresh Potato to Final Packet"
        stages={chipsStages}
      />

      <FeaturedProducts />

      <AboutBlurb />

      <div className="border-t border-gold/10">
        <NimkoComingSoon />
      </div>

      <Testimonials />
    </>
  );
}
