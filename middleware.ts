import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig } from "@/auth.config";

// Uses the lightweight, provider-free auth config (see auth.config.ts) so
// this Edge Runtime bundle stays small — pulling in bcrypt/Prisma here
// pushes past Vercel's Edge Function size limit.
const { auth } = NextAuth(authConfig);

// This runs on EVERY request before it reaches a page or API route.
// Two jobs:
// 1. Attach security headers to every response (defends against
//    clickjacking, MIME-sniffing attacks, and helps enforce HTTPS).
// 2. Block access to /admin/* pages (except the login page itself)
//    unless the visitor has a valid session. This is the server-side
//    check — never trust a client-side "if user is admin, show page"
//    check alone, because that can be bypassed by editing JS in the browser.

export default auth((req: NextRequest & { auth?: unknown }) => {
  const pathname = req.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";

  // /api/orders is special: POST is the public checkout endpoint (any
  // customer can place an order without logging in), but GET (list) and
  // PATCH (status update) are admin-only. Every other admin-sensitive
  // route is blanket-protected for all non-GET methods.
  const isPublicOrderCreation = pathname === "/api/orders" && req.method === "POST";
  const isAdminApiRoute =
    !isPublicOrderCreation &&
    pathname.startsWith("/api/") &&
    [
      "/api/products",
      "/api/orders",
      "/api/settings",
      "/api/site-content",
      "/api/admin-users",
      "/api/story-stages",
      "/api/delivery-cities",
      "/api/brand-story",
    ].some((p) => pathname.startsWith(p)) &&
    req.method !== "GET";

  if ((isAdminRoute || isAdminApiRoute) && !req.auth) {
    if (isAdminApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://res.cloudinary.com",
      "font-src 'self' data:",
      "connect-src 'self'",
    ].join("; ")
  );

  return response;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
