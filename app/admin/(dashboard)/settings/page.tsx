import { getSiteSettings } from "@/lib/get-site-settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl text-cream">Site Settings</h1>
      <p className="mt-1 text-sm text-cream-dim">
        Update contact info, social links, and site-wide text without touching any code.
      </p>
      <div className="mt-6">
        <SettingsForm
          initialData={{
            logoUrl: settings.logoUrl ?? "",
            heroImageUrl: settings.heroImageUrl ?? "",
            contactEmail: settings.contactEmail ?? "",
            contactPhone: settings.contactPhone ?? "",
            whatsappNumber: settings.whatsappNumber ?? "",
            instagramUrl: settings.instagramUrl ?? "",
            facebookUrl: settings.facebookUrl ?? "",
            tiktokUrl: settings.tiktokUrl ?? "",
            bannerText: settings.bannerText ?? "",
            footerText: settings.footerText ?? "",
            freeDeliveryThreshold: settings.freeDeliveryThreshold,
            standardShippingFee: settings.standardShippingFee,
          }}
        />
      </div>
    </div>
  );
}
