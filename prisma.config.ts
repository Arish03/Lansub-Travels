import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
  migrate: {
    async adapter() {
      const { PrismaBetterSqlite3 } = await import(
        "@prisma/adapter-better-sqlite3"
      );
      const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
      const filePath = dbUrl.replace("file:", "");
      return new PrismaBetterSqlite3({ url: filePath });
    },
  },
});
