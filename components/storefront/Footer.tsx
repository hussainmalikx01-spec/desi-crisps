import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import InstagramIcon from "@/components/icons/InstagramIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import TikTokIcon from "@/components/icons/TikTokIcon";
import { getSiteSettings } from "@/lib/get-site-settings";
import NewsletterForm from "./NewsletterForm";

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="border-t border-gold/15 bg-ink-soft">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <h3 className="font-display text-xl text-cream">Desi Crisps</h3>
            <p className="mt-3 text-sm text-cream-dim">{settings.footerText}</p>
            <div className="mt-4 flex gap-4">
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <InstagramIcon size={20} className="text-cream-dim hover:text-gold-light transition-colors" />
                </a>
              )}
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FacebookIcon size={20} className="text-cream-dim hover:text-gold-light transition-colors" />
                </a>
              )}
              {settings.tiktokUrl && (
                <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <TikTokIcon size={20} className="text-cream-dim hover:text-gold-light transition-colors" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-utility text-xs uppercase tracking-wider text-gold">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm text-cream-dim">
              <li><Link href="/shop" className="hover:text-cream">All Products</Link></li>
              <li><Link href="/shop?line=NIMKO" className="hover:text-cream">Nimko (Coming Soon)</Link></li>
              <li><Link href="/reviews" className="hover:text-cream">Reviews</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-utility text-xs uppercase tracking-wider text-gold">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-cream-dim">
              <li><Link href="/about" className="hover:text-cream">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-cream">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-cream">FAQ</Link></li>
              <li><Link href="/legal/privacy-policy" className="hover:text-cream">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-cream">Terms &amp; Conditions</Link></li>
              <li><Link href="/legal/refund-policy" className="hover:text-cream">Refund Policy</Link></li>
              <li><Link href="/legal/shipping-policy" className="hover:text-cream">Shipping Policy</Link></li>
            </ul>
            <div className="mt-4 space-y-1 text-sm text-cream-dim">
              <p className="flex items-center gap-2"><Mail size={14} /> {settings.contactEmail}</p>
              <p className="flex items-center gap-2"><Phone size={14} /> {settings.contactPhone}</p>
            </div>
          </div>

          <div>
            <h4 className="font-utility text-xs uppercase tracking-wider text-gold">Get Nimko updates</h4>
            <p className="mt-4 text-sm text-cream-dim">Be first to know when our nimko line launches.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="rule-gold mt-12" />
        <p className="mt-6 text-center text-xs text-cream-dim/70 font-utility">
          © {new Date().getFullYear()} Desi Crisps. Quality You Can Trust.
        </p>
      </div>
    </footer>
  );
}
