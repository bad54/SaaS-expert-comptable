import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Prisma 7 with client engine requires adapter or accelerateUrl.
  // Use accelerateUrl pointing to the database for now.
  const url = process.env.DATABASE_URL;
  if (!url) {
    // Return a proxy that throws a helpful error on any property access
    // This allows the app to build without a DB connection
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === "then" || prop === Symbol.toPrimitive || prop === Symbol.toStringTag) {
          return undefined;
        }
        throw new Error(
          `DATABASE_URL is not set. Please configure your .env.local file. See .env.example for reference.`
        );
      },
    });
  }
  return new PrismaClient({
    accelerateUrl: url,
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
