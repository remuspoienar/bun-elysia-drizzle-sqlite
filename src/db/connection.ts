import { Database, constants } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import config from "../../drizzle.config";
import { logger } from "../common/logger";
import * as schema from "./schema";

const sqlite = new Database(config.dbCredentials.url, { create: true });
sqlite.exec("PRAGMA journal_mode = WAL;");
sqlite.fileControl(constants.SQLITE_FCNTL_PERSIST_WAL, 0);

export const db = drizzle(sqlite, { schema, logger });
export const closeDb = () => sqlite.close();
export const rawDb = sqlite

export default db;
