import { PrismaClient } from "@prisma/client";

// Next.js dev mode reloads files often — without this, every reload
// would create a brand-new database connection and eventually crash
// the app with "too many connections". We stash one instance on the
// global object and reuse it.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
