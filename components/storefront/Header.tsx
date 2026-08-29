import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/get-site-settings";
import CartIndicator from "./CartIndicator";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default async function Header() {
  const settings = await getSiteSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-ink/90 backdrop-blur-md">
      {settings.bannerText && (
        <div className="bg-gold text-ink text-center text-xs font-utility tracking-wide uppercase py-1.5 px-4">
          {settings.bannerText}
        </div>
      )}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src={settings.logoUrl}
            alt="Desi Crisps"
            width={56}
            height={56}
            className="rounded-full"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-utility text-sm uppercase tracking-wide text-cream-dim transition-colors hover:text-gold-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <CartIndicator />
      </div>
    </header>
  );
}
