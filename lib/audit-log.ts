import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * Records who did what, when — for accountability. Call this from any
 * admin API route that changes data (product edit, order status change,
 * settings update, etc.).
 */
export async function logAdminAction(
  adminUserId: string,
  action: string,
  targetId?: string,
  details?: Record<string, unknown>
) {
  await prisma.auditLog.create({
    data: {
      adminUserId,
      action,
      targetId,
      // Prisma's generated Json input type doesn't structurally accept a
      // plain `Record<string, unknown>` without this cast, even though the
      // actual values are always JSON-serializable here.
      details: details as Prisma.InputJsonValue | undefined,
    },
  });
}
