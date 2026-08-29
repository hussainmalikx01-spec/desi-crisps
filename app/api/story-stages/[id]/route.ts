import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { storyStageSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit-log";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = storyStageSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const stage = await prisma.storyStage.update({ where: { id }, data: parsed.data });
  await logAdminAction(session.user.id as string, "story_stage.update", id, parsed.data);

  return NextResponse.json(stage);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.storyStage.delete({ where: { id } });
  await logAdminAction(session.user.id as string, "story_stage.delete", id);

  return NextResponse.json({ success: true });
}
