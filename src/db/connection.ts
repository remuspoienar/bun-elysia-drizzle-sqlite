import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { logger } from "../common/logger";
import * as schema from "./schema";

const sqlite = new Database("sqlite/realworld.sqlite", { create: true });
sqlite.exec("PRAGMA journal_mode = WAL;");

export const db = drizzle(sqlite, { schema, logger });
export const closeDb = () => sqlite.close();

export default db;
