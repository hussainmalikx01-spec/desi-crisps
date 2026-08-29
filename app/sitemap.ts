import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// Set NEXT_PUBLIC_SITE_URL in your .env / Vercel project settings once you
// have a real domain (e.g. https://desicrisps.pk). Falls back to the
// Vercel-provided URL during preview/staging so this never breaks.
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const staticRoutes = [
    "",
    "/shop",
    "/about",
    "/reviews",
    "/contact",
    "/faq",
    "/legal/privacy-policy",
    "/legal/terms",
    "/legal/refund-policy",
    "/legal/shipping-policy",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
