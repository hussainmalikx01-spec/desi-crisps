import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { success } = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!success) {
    return NextResponse.json({ error: "Too many messages sent. Try again later." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  // In production, send this via the email module (Resend) to the admin.
  // Kept minimal here since it's a simple contact form, not an order.
  const { emailAdminNewOrder } = await import("@/lib/notifications/email");
  await emailAdminNewOrder({
    id: "contact-form",
    customerName: parsed.data.name,
    total: "-",
    itemsSummary: `New contact message: ${parsed.data.message}`,
  }).catch(() => {});

  return NextResponse.json({ message: "Thanks for reaching out! We'll get back to you soon." });
}
