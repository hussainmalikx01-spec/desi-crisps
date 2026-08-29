"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquareText,
  Settings,
  Users,
  LogOut,
  Images,
  FileText,
  Truck,
  HelpCircle,
  BookOpen,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareText },
  { href: "/admin/content", label: "Site Content", icon: FileText },
  { href: "/admin/story", label: "Story Images", icon: Images },
  { href: "/admin/brand-story", label: "Our Story Timeline", icon: BookOpen },
  { href: "/admin/delivery", label: "Delivery Cities", icon: Truck },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/users", label: "Admin Users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer automatically whenever the user navigates.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar — only visible below the md breakpoint. Gives
          phones a real, reachable menu trigger instead of a squeezed
          full-width sidebar. */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gold/10 bg-ink-soft px-4 py-3 md:hidden">
        <span className="font-display text-lg text-cream">
          Desi Crisps <span className="font-utility text-[10px] uppercase text-gold">Admin</span>
        </span>
        <button
          onClick={() => setOpen(true)}
          className="rounded-sm p-2 text-cream hover:bg-gold/10"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Backdrop — tapping it closes the drawer, mobile only. */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col border-r border-gold/10 bg-ink-soft transition-transform duration-300 ease-out md:static md:h-screen md:w-60 md:translate-x-0 ${
          open ? "translate-x-0" : ""
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg text-cream">Desi Crisps</span>
            <span className="font-utility text-[10px] uppercase text-gold">Admin</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-sm p-1 text-cream-dim hover:text-cream md:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-gold/10 text-gold-light" : "text-cream-dim hover:bg-gold/5 hover:text-cream"
                }`}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mx-3 mb-6 flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-cream-dim transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </aside>
    </>
  );
}
