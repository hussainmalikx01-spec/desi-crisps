import { prisma } from "@/lib/prisma";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import AddAdminForm from "@/components/admin/AddAdminForm";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admins = await prisma.adminUser.findMany({
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-cream">Admin Users</h1>

      <div className="mt-6 rounded-sm border border-gold/15 bg-ink-card p-5">
        <h2 className="font-utility text-xs uppercase tracking-wide text-gold">Current Admins</h2>
        <div className="mt-3 space-y-2">
          {admins.map((a) => (
            <div key={a.id} className="flex justify-between text-sm">
              <span className="text-cream">{a.name}</span>
              <span className="text-cream-dim">{a.email}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg text-cream">Change Your Password</h2>
        <div className="mt-4">
          <ChangePasswordForm />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg text-cream">Add New Admin</h2>
        <div className="mt-4">
          <AddAdminForm />
        </div>
      </div>
    </div>
  );
}
