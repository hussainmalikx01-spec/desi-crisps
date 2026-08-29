import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit-log";

// GET /api/products — public, returns published products (or all, for admin)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const line = searchParams.get("line"); // CHIPS | NIMKO
  const session = await auth();
  const isAdmin = !!session?.user;

  const products = await prisma.product.findMany({
    where: {
      ...(line ? { line: line as "CHIPS" | "NIMKO" } : {}),
      // Public visitors only see published products; admins see everything.
      ...(isAdmin ? {} : { status: "PUBLISHED" }),
    },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

// POST /api/products — admin only (enforced by middleware.ts too)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A product with this slug already exists." }, { status: 409 });
  }

  const { images, ...productData } = parsed.data;
  const product = await prisma.product.create({
    data: {
      ...productData,
      images: images
        ? { create: images.map((img, i) => ({ url: img.url, sortOrder: i })) }
        : undefined,
    },
  });
  await logAdminAction(session.user.id as string, "product.create", product.id, parsed.data);

  return NextResponse.json(product, { status: 201 });
}
