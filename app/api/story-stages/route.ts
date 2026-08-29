import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { storyStageSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit-log";

// GET — public sees only active stages, ordered for display. Admin (logged
// in) sees everything, including inactive stages, so they can re-enable them.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const line = searchParams.get("line"); // CHIPS | NIMKO
  const session = await auth();

  const stages = await prisma.storyStage.findMany({
    where: {
      ...(line ? { line: line as "CHIPS" | "NIMKO" } : {}),
      ...(session?.user ? {} : { active: true }),
    },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(stages);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = storyStageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const stage = await prisma.storyStage.create({ data: parsed.data });
  await logAdminAction(session.user.id as string, "story_stage.create", stage.id, parsed.data);

  return NextResponse.json(stage, { status: 201 });
}
