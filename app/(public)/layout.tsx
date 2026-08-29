import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import WhatsAppButton from "@/components/storefront/WhatsAppButton";
import BackToTop from "@/components/storefront/BackToTop";
import Providers from "@/components/Providers";
import { getSiteSettings } from "@/lib/get-site-settings";

// Applies to every page under this layout, including client-component
// pages like /cart and /checkout that can't export their own route
// config — guarantees the header/footer (logo, contact info, banner
// text) are never served from a stale build-time snapshot.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <Providers>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      {settings.whatsappNumber && <WhatsAppButton number={settings.whatsappNumber} />}
      <BackToTop />
    </Providers>
  );
}
