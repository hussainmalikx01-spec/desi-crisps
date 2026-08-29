import { prisma } from "@/lib/prisma";
import BrandStoryManager from "@/components/admin/BrandStoryManager";

export const dynamic = "force-dynamic";

export default async function AdminBrandStoryPage() {
  const milestones = await prisma.brandStoryMilestone.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl text-cream">Our Story Timeline</h1>
      <p className="mt-1 text-sm text-cream-dim">
        Manage the brand milestone timeline shown on the About page — separate from the potato/nimko
        production animation.
      </p>
      <div className="mt-8">
        <BrandStoryManager initialMilestones={milestones} />
      </div>
    </div>
  );
}
