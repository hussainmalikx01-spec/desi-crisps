import { prisma } from "@/lib/prisma";
import StoryStagesManager from "@/components/admin/StoryStagesManager";

export const dynamic = "force-dynamic";

export default async function AdminStoryPage() {
  const [chipsStages, nimkoStages] = await Promise.all([
    prisma.storyStage.findMany({ where: { line: "CHIPS" }, orderBy: { sortOrder: "asc" } }),
    prisma.storyStage.findMany({ where: { line: "NIMKO" }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl text-cream">Story Animation</h1>
      <p className="mt-1 text-sm text-cream-dim">
        Fully control the potato-to-packet and nimko scroll animations — add, edit, reorder, or
        deactivate stages. The customer-facing animation updates automatically.
      </p>

      <div className="mt-8">
        <h2 className="font-display text-lg text-cream">Chips Journey</h2>
        <div className="mt-4">
          <StoryStagesManager line="CHIPS" initialStages={chipsStages} />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-lg text-cream">Nimko Journey</h2>
        <div className="mt-4">
          <StoryStagesManager line="NIMKO" initialStages={nimkoStages} />
        </div>
      </div>
    </div>
  );
}
