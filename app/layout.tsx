import type { Metadata } from "next";
import { Fraunces, Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  title: "Desi Crisps — Quality You Can Trust",
  description:
    "Farm-fresh potato crisps and nimko, made the honest way. Desi Crisps brings premium, home-style snacking to your doorstep.",
  openGraph: {
    title: "Desi Crisps — Quality You Can Trust",
    description: "Farm-fresh potato crisps and nimko, made the honest way.",
    images: ["/assets/logo/desi-crisps-logo.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Desi Crisps",
  description: "Premium farm-fresh potato crisps and nimko, made the honest way.",
  logo: "/assets/logo/desi-crisps-logo.png",
  slogan: "Quality You Can Trust",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <Toaster theme="dark" position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  );
}
