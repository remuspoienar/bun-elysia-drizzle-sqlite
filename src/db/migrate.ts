import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import db, { closeDb } from "./connection";

import dbConfig from "../../drizzle.config";

migrate(db, { migrationsFolder: dbConfig.out });
closeDb();
