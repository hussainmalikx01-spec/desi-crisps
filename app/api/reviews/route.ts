import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// GET /api/reviews — public sees only approved; admin sees all (add ?all=1)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session = await auth();
  const wantsAll = searchParams.get("all") === "1" && !!session?.user;

  const reviews = await prisma.review.findMany({
    where: wantsAll ? {} : { status: "APPROVED" },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

// POST /api/reviews — public submission, goes into moderation queue (PENDING)
export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { success } = rateLimit(`review:${ip}`, { limit: 3, windowMs: 10 * 60 * 1000 });
  if (!success) {
    return NextResponse.json({ error: "Too many reviews submitted. Try again later." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const review = await prisma.review.create({
    data: { ...parsed.data, status: "PENDING" },
  });

  return NextResponse.json(
    { message: "Thank you! Your review will appear after moderation.", id: review.id },
    { status: 201 }
  );
}
