import { prisma } from "@/lib/prisma";

// Cached defaults so the site still renders sensibly before the admin
// fills in real settings for the first time.
const DEFAULTS = {
  logoUrl: "/assets/logo/desi-crisps-logo.png",
  heroImageUrl: "",
  contactEmail: "hello@desicrisps.pk",
  contactPhone: "+92 300 0000000",
  whatsappNumber: "+923000000000",
  instagramUrl: "https://instagram.com/desicrisps",
  facebookUrl: "https://facebook.com/desicrisps",
  tiktokUrl: "",
  bannerText: "Free delivery on orders above Rs. 1500",
  footerText: "Desi Crisps — farm-fresh snacks, made the honest way.",
  freeDeliveryThreshold: 1500,
  standardShippingFee: 150,
  faqItems: [] as { question: string; answer: string }[],
};

/**
 * Prisma types every nullable column as `T | null`, even ones we always
 * expect to have a value (falling back to DEFAULTS above). Every field is
 * explicitly coalesced here — not just spread — so the return type is
 * guaranteed non-null `string`/`number` everywhere it's consumed (Next's
 * <Image> src, plain text props, etc. all reject `null`).
 */
export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return {
    logoUrl: settings?.logoUrl || DEFAULTS.logoUrl,
    heroImageUrl: settings?.heroImageUrl || DEFAULTS.heroImageUrl,
    contactEmail: settings?.contactEmail || DEFAULTS.contactEmail,
    contactPhone: settings?.contactPhone || DEFAULTS.contactPhone,
    whatsappNumber: settings?.whatsappNumber || DEFAULTS.whatsappNumber,
    instagramUrl: settings?.instagramUrl || DEFAULTS.instagramUrl,
    facebookUrl: settings?.facebookUrl || DEFAULTS.facebookUrl,
    tiktokUrl: settings?.tiktokUrl || DEFAULTS.tiktokUrl,
    bannerText: settings?.bannerText || DEFAULTS.bannerText,
    footerText: settings?.footerText || DEFAULTS.footerText,
    freeDeliveryThreshold: settings?.freeDeliveryThreshold ?? DEFAULTS.freeDeliveryThreshold,
    standardShippingFee: settings?.standardShippingFee ?? DEFAULTS.standardShippingFee,
    faqItems: Array.isArray(settings?.faqItems)
      ? (settings.faqItems as { question: string; answer: string }[])
      : DEFAULTS.faqItems,
  };
}
