import type { Config } from "drizzle-kit";

export default {
  schema: "src/db/schema.ts",
  out: "./sqlite/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: Bun.env.DB || "sqlite/realworld.sqlite"
  }
} satisfies Config;
