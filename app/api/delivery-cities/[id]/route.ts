import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deliveryCitySchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit-log";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = deliveryCitySchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const city = await prisma.deliveryCity.update({ where: { id }, data: parsed.data });
  await logAdminAction(session.user.id as string, "delivery_city.update", id, parsed.data);

  return NextResponse.json(city);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.deliveryCity.delete({ where: { id } });
  await logAdminAction(session.user.id as string, "delivery_city.delete", id);

  return NextResponse.json({ success: true });
}
