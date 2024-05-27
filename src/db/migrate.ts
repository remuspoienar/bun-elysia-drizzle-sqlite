import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import db, { closeDb } from "./connection";

migrate(db, { migrationsFolder: "sqlite/migrations" });
closeDb();
