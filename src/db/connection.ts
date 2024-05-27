import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { users } from "./schema";

const sqlite = new Database("sqlite/realworld.sqlite", { create: true });
sqlite.exec("PRAGMA journal_mode = WAL;");

export const closeDb = () => sqlite.close();
export default drizzle(sqlite, { schema: { users: users } });
