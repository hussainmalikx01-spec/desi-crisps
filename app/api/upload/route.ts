import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { validateImageFile, uploadImage } from "@/lib/cloudinary";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ip = getClientIp(req.headers);
  const { success } = rateLimit(`upload:${ip}`, { limit: 20, windowMs: 10 * 60 * 1000 });
  if (!success) return NextResponse.json({ error: "Too many uploads. Slow down." }, { status: 429 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "misc";

  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });

  const validation = validateImageFile(file);
  if (!validation.valid) return NextResponse.json({ error: validation.error }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadImage(buffer, folder);

  return NextResponse.json(result, { status: 201 });
}
