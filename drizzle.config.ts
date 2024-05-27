import type { Config } from "drizzle-kit";

export default {
  schema: "src/db/schema.ts",
  out: "./sqlite/migrations",
  driver: "better-sqlite",
  dbCredentials: {
    url: "sqlite/realworld.sqlite"
  }
} satisfies Config;
