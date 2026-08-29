import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const admin = await prisma.adminUser.findUnique({ where: { email } });
        if (!admin) return null;

        // Account locked out after too many failed attempts.
        if (admin.lockedUntil && admin.lockedUntil > new Date()) {
          throw new Error(
            `Account locked. Try again after ${admin.lockedUntil.toLocaleTimeString()}.`
          );
        }

        const isValid = await bcrypt.compare(password, admin.passwordHash);

        if (!isValid) {
          const attempts = admin.failedLoginAttempts + 1;
          const shouldLock = attempts >= MAX_FAILED_ATTEMPTS;
          await prisma.adminUser.update({
            where: { id: admin.id },
            data: {
              failedLoginAttempts: shouldLock ? 0 : attempts,
              lockedUntil: shouldLock
                ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
                : null,
            },
          });
          return null;
        }

        // Successful login — reset the failed-attempt counter.
        await prisma.adminUser.update({
          where: { id: admin.id },
          data: { failedLoginAttempts: 0, lockedUntil: null },
        });

        return { id: admin.id, email: admin.email, name: admin.name };
      },
    }),
  ],
});
