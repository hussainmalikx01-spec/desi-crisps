import type { NextAuthConfig } from "next-auth";

/**
 * Lightweight auth config with NO providers (no bcrypt, no Prisma).
 * This is imported by middleware.ts, which runs on Vercel's Edge Runtime
 * and has a strict bundle size limit — pulling in bcrypt/Prisma there
 * blew past that limit. Middleware only needs to check "does a valid
 * session cookie exist?", not run the actual login logic, so it can use
 * this trimmed-down config safely.
 *
 * The full config (with the Credentials provider) lives in lib/auth.ts
 * and is used everywhere else (API routes, server components).
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
};
