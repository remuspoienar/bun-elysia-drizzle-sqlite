import { afterAll, beforeAll, beforeEach } from "bun:test";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import db, { closeDb } from "../../src/db/connection";
import { sql } from "drizzle-orm";

beforeAll(() => {
  migrate(db, { migrationsFolder: "sqlite/migrations" });
});

beforeEach(() => {
  const queries = [
    "DELETE FROM articles",
    "DELETE FROM users",
    "DELETE FROM comments",
    "DELETE from tags",
    "DELETE from tagsArticles",
    "DELETE from userFollows",
  ];

  queries.forEach(q => db.run(sql.raw(q)));
});

afterAll(() => {
  closeDb();
});
