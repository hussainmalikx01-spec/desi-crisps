import { notFound } from "next/navigation";
import { getSiteContent, CONTENT_KEYS } from "@/lib/site-content";

export const dynamic = "force-dynamic";

const PAGES: Record<string, { title: string; contentKey: string }> = {
  "privacy-policy": { title: "Privacy Policy", contentKey: CONTENT_KEYS.legalPrivacyPolicy },
  terms: { title: "Terms & Conditions", contentKey: CONTENT_KEYS.legalTerms },
  "refund-policy": { title: "Refund & Return Policy", contentKey: CONTENT_KEYS.legalRefundPolicy },
  "shipping-policy": { title: "Shipping Policy", contentKey: CONTENT_KEYS.legalShippingPolicy },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  return { title: page ? `${page.title} — Desi Crisps` : "Desi Crisps" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  const content = await getSiteContent();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl text-cream">{page.title}</h1>
      <div className="mt-8 whitespace-pre-line leading-relaxed text-cream-dim">
        {content[page.contentKey]}
      </div>
    </div>
  );
}
