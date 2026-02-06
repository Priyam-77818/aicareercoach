import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["error", "warn"],
    transactionOptions: {
      maxWait: 15000,
      timeout: 30000,
    },
  });
} else {
  // Avoid creating multiple instances in development (Next.js hot reload)
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient({
      log: ["error", "warn"],
      transactionOptions: {
        maxWait: 15000,
        timeout: 30000,
      },
    });
  }
  prisma = globalThis.prisma;
}

export const db = prisma;
