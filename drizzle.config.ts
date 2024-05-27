import type { Config } from "drizzle-kit";

export default {
  schema: "src/db/schema.ts",
  out: "./sqlite/migrations",
  driver: "better-sqlite",
  dbCredentials: {
    // workaround because Bun.env.DB does not work for drizzle-kit, currently throwing ReferenceError: Bun is not defined
    url: process.env.DB || "sqlite/realworld.sqlite"
  }
} satisfies Config;
