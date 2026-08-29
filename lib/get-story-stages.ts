import { prisma } from "@/lib/prisma";
import { CHIPS_PROCESS, NIMKO_PROCESS, type ProcessStage } from "@/lib/story-data";

/**
 * Fetches active story stages for a product line from the database,
 * ordered for display. If the admin hasn't set up any stages yet (fresh
 * install, before seeding), falls back to the built-in defaults so the
 * animation is never empty or broken.
 *
 * This lives in its own file (not lib/story-data.ts) because it imports
 * Prisma, and lib/story-data.ts is also imported by the client-side
 * ProcessStory component for its type definitions — keeping Prisma out
 * of that file avoids accidentally bundling server-only code for the browser.
 */
export async function getStoryStages(line: "CHIPS" | "NIMKO"): Promise<ProcessStage[]> {
  const stages = await prisma.storyStage.findMany({
    where: { line, active: true },
    orderBy: { sortOrder: "asc" },
  });

  if (stages.length === 0) {
    return line === "CHIPS" ? CHIPS_PROCESS : NIMKO_PROCESS;
  }

  return stages.map((s) => ({ label: s.label, caption: s.caption, icon: s.imageUrl }));
}
