import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { type Static } from "elysia";
import { tags } from "../../db/schema";

export const tagInsert = createInsertSchema(tags);
export const tagSelect = createSelectSchema(tags);

export type TagInsert = Static<typeof tagInsert>;
export type Tag = Static<typeof tagSelect>;
