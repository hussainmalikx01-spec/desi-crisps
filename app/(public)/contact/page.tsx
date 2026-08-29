import { getSiteSettings } from "@/lib/get-site-settings";
import ContactForm from "@/components/storefront/ContactForm";
import { Mail, Phone } from "lucide-react";
import InstagramIcon from "@/components/icons/InstagramIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";

export const dynamic = "force-dynamic";

export const metadata = { title: "Contact Us — Desi Crisps" };

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <p className="font-utility text-xs uppercase tracking-[0.3em] text-gold">Get in Touch</p>
        <h1 className="mt-3 font-display text-4xl text-cream">Contact Us</h1>
      </div>

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        <ContactForm />

        <div className="space-y-6">
          <InfoRow icon={<Mail size={18} />} label="Email" value={settings.contactEmail} href={`mailto:${settings.contactEmail}`} />
          <InfoRow icon={<Phone size={18} />} label="Phone" value={settings.contactPhone} href={`tel:${settings.contactPhone}`} />
          {settings.instagramUrl && (
            <InfoRow icon={<InstagramIcon size={18} />} label="Instagram" value="@desicrisps" href={settings.instagramUrl} />
          )}
          {settings.facebookUrl && (
            <InfoRow icon={<FacebookIcon size={18} />} label="Facebook" value="Desi Crisps" href={settings.facebookUrl} />
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 rounded-sm border border-gold/15 bg-ink-card p-4 transition-colors hover:border-gold/40">
      <span className="text-gold">{icon}</span>
      <div>
        <p className="font-utility text-xs uppercase tracking-wide text-cream-dim">{label}</p>
        <p className="mt-1 text-cream">{value}</p>
      </div>
    </a>
  );
}
