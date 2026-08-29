import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit-log";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { images, ...productData } = parsed.data;
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...productData,
      // Replace the full image set on every save — simplest to reason
      // about since the admin UI always sends the complete current list.
      ...(images
        ? { images: { deleteMany: {}, create: images.map((img, i) => ({ url: img.url, sortOrder: i })) } }
        : {}),
    },
  });
  await logAdminAction(session.user.id as string, "product.update", id, parsed.data);

  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  await logAdminAction(session.user.id as string, "product.delete", id);

  return NextResponse.json({ success: true });
}
