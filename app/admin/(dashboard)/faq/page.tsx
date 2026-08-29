import { getSiteSettings } from "@/lib/get-site-settings";
import FaqItemsForm from "@/components/admin/FaqItemsForm";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-cream">FAQ</h1>
      <p className="mt-1 text-sm text-cream-dim">
        Manage the questions and answers shown on the public FAQ page.
      </p>
      <div className="mt-6">
        <FaqItemsForm initialItems={settings.faqItems} />
      </div>
    </div>
  );
}
