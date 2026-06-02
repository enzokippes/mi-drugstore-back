import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const isProduction = !!process.env.TURSO_DATABASE_URL;

const adapter = new PrismaLibSql({
  url: isProduction ? process.env.TURSO_DATABASE_URL! : (process.env.DATABASE_URL || "file:./dev.db"),
  authToken: isProduction ? process.env.TURSO_AUTH_TOKEN : undefined,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
