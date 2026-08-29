import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deliveryCitySchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit-log";

// GET — public. Storefront checkout uses this to populate the city
// dropdown. Admins (logged in) see inactive cities too so they can
// re-enable them; regular customers only see active ones.
export async function GET() {
  const session = await auth();
  const cities = await prisma.deliveryCity.findMany({
    where: session?.user ? {} : { active: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(cities);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = deliveryCitySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const existing = await prisma.deliveryCity.findUnique({ where: { name: parsed.data.name } });
  if (existing) return NextResponse.json({ error: "This city already exists." }, { status: 409 });

  const city = await prisma.deliveryCity.create({ data: parsed.data });
  await logAdminAction(session.user.id as string, "delivery_city.create", city.id, parsed.data);

  return NextResponse.json(city, { status: 201 });
}
