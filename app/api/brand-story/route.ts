import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { brandStoryMilestoneSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit-log";

export async function GET() {
  const session = await auth();
  const milestones = await prisma.brandStoryMilestone.findMany({
    where: session?.user ? {} : { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(milestones);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = brandStoryMilestoneSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const milestone = await prisma.brandStoryMilestone.create({ data: parsed.data });
  await logAdminAction(session.user.id as string, "brand_story.create", milestone.id, parsed.data);

  return NextResponse.json(milestone, { status: 201 });
}
