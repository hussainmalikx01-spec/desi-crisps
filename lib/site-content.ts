import { prisma } from "@/lib/prisma";

/**
 * Every editable text block on the site has a stable key here. The admin
 * "Site Content" page reads/writes these keys; public pages read them with
 * a fallback to DEFAULT_CONTENT so the site never shows blank text before
 * an admin has customized anything.
 */
export const CONTENT_KEYS = {
  heroEyebrow: "hero.eyebrow",
  heroHeadingLine1: "hero.heading_line1",
  heroHeadingLine2: "hero.heading_line2",
  heroSubtext: "hero.subtext",

  aboutEyebrow: "about.eyebrow",
  aboutHeading: "about.heading",
  aboutIntro: "about.intro",
  aboutSection1Title: "about.section1_title",
  aboutSection1Body: "about.section1_body",
  aboutSection2Title: "about.section2_title",
  aboutSection2Body: "about.section2_body",

  legalPrivacyPolicy: "legal.privacy-policy",
  legalTerms: "legal.terms",
  legalRefundPolicy: "legal.refund-policy",
  legalShippingPolicy: "legal.shipping-policy",
} as const;

export const DEFAULT_CONTENT: Record<string, string> = {
  [CONTENT_KEYS.heroEyebrow]: "Since the family kitchen",
  [CONTENT_KEYS.heroHeadingLine1]: "From Potato",
  [CONTENT_KEYS.heroHeadingLine2]: "to Crunch",
  [CONTENT_KEYS.heroSubtext]:
    "From fresh potatoes to your favorite crunch — every Desi Crisps packet carries the same promise: quality you can trust.",

  [CONTENT_KEYS.aboutEyebrow]: "Our Story",
  [CONTENT_KEYS.aboutHeading]: "Quality You Can Trust",
  [CONTENT_KEYS.aboutIntro]:
    "Desi Crisps started the way most honest things do — in a family kitchen, with a potato, a knife, and a recipe passed down more by taste than by measurement. What began as a countryside tradition is now a promise we keep in every packet: real ingredients, real care, nothing hidden.",
  [CONTENT_KEYS.aboutSection1Title]: "Farm-to-packet, always",
  [CONTENT_KEYS.aboutSection1Body]:
    "Every batch starts with potatoes sourced from farms we know by name. We wash, peel, and slice them the same day — no long cold storage, no shortcuts. It's slower, but it's the only way we know how to do it right.",
  [CONTENT_KEYS.aboutSection2Title]: "Made in small batches",
  [CONTENT_KEYS.aboutSection2Body]:
    "We fry in controlled, small batches so every chip gets the same golden crunch and the same careful seasoning — not mass-produced sameness, but consistent quality you can taste.",

  [CONTENT_KEYS.legalPrivacyPolicy]: `[EDIT ME — have a lawyer review this before publishing]

Desi Crisps collects only the information needed to process your order: your name, phone number, delivery address, and optionally your email. We do not sell or share this information with third parties except delivery partners, and only to the extent needed to fulfill your order.

We use cookies to remember items in your cart. We do not track you across other websites.

You can request that we delete your personal data at any time by contacting us at the email listed on our Contact page.`,

  [CONTENT_KEYS.legalTerms]: `[EDIT ME — have a lawyer review this before publishing]

By placing an order with Desi Crisps, you agree to provide accurate delivery information and to pay the listed price plus shipping upon delivery (Cash on Delivery).

We reserve the right to cancel orders in cases of stock unavailability or suspected fraud. Prices are subject to change without notice, though confirmed orders will honor the price at time of purchase.`,

  [CONTENT_KEYS.legalRefundPolicy]: `[EDIT ME — have a lawyer review this before publishing]

If your order arrives damaged, incorrect, or below our quality standard, contact us within 48 hours of delivery with a photo of the product, and we will arrange a replacement or refund.

As these are perishable food items, we cannot accept returns of opened products unless there is a quality defect.`,

  [CONTENT_KEYS.legalShippingPolicy]: `[EDIT ME — have a lawyer review this before publishing]

We currently deliver across Pakistan. Standard delivery takes 2–5 business days depending on your city. A flat shipping fee applies at checkout; orders above a certain amount may qualify for free delivery (see the banner at the top of the site).

You will receive a WhatsApp or email update as your order is confirmed, shipped, and delivered.`,
};

export async function getSiteContent(): Promise<Record<string, string>> {
  const rows = await prisma.siteContent.findMany();
  const overrides: Record<string, string> = {};
  rows.forEach((row) => {
    overrides[row.key] = row.value;
  });
  return { ...DEFAULT_CONTENT, ...overrides };
}
