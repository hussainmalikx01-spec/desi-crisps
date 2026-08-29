import { getSiteSettings } from "@/lib/get-site-settings";
import FaqAccordion from "@/components/storefront/FaqAccordion";

export const dynamic = "force-dynamic";

export const metadata = { title: "FAQ — Desi Crisps" };

const DEFAULT_FAQS = [
  {
    question: "How long does delivery take?",
    answer: "Standard delivery takes 2–5 business days depending on your city.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "Currently we accept Cash on Delivery (COD) only. More options are coming soon.",
  },
  {
    question: "Do you deliver outside the listed cities?",
    answer: "Not yet — but we're expanding. Check back soon or contact us to request your city.",
  },
  {
    question: "What if my order arrives damaged?",
    answer: "Contact us within 48 hours with a photo and we'll arrange a replacement or refund.",
  },
];

export default async function FaqPage() {
  const settings = await getSiteSettings();
  const faqs = settings.faqItems.length > 0 ? settings.faqItems : DEFAULT_FAQS;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="text-center">
        <p className="font-utility text-xs uppercase tracking-[0.3em] text-gold">Help</p>
        <h1 className="mt-3 font-display text-4xl text-cream">Frequently Asked Questions</h1>
      </div>

      <div className="mt-14">
        <FaqAccordion items={faqs} />
      </div>
    </div>
  );
}
