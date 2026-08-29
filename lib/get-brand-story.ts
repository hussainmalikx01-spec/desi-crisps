import { prisma } from "@/lib/prisma";

export async function getBrandStoryMilestones() {
  return prisma.brandStoryMilestone.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}
