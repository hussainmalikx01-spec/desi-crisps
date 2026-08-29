import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { brandStoryMilestoneSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit-log";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = brandStoryMilestoneSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const milestone = await prisma.brandStoryMilestone.update({ where: { id }, data: parsed.data });
  await logAdminAction(session.user.id as string, "brand_story.update", id, parsed.data);

  return NextResponse.json(milestone);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.brandStoryMilestone.delete({ where: { id } });
  await logAdminAction(session.user.id as string, "brand_story.delete", id);

  return NextResponse.json({ success: true });
}
