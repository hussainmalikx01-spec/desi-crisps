import AdminProviders from "@/components/admin/AdminProviders";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "sonner";

// Extra safety net on top of the per-page "force-dynamic" exports —
// nothing in the admin panel should ever be served from a build-time
// cache, since it's all live business data (orders, products, settings).
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProviders>
      <div className="min-h-screen bg-ink md:flex">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-5 md:p-8">{children}</main>
      </div>
      <Toaster theme="dark" position="top-center" richColors />
    </AdminProviders>
  );
}
