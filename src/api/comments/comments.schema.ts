import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t, type Static } from "elysia";
import { comments } from "../../db/schema";

export const commentInsert = createInsertSchema(comments);
export const commentSelect = createSelectSchema(comments);
export const commentPayload = t.Pick(commentInsert, ["body"]);

export type CommentInsert = Static<typeof commentInsert>;
export type Comment = Static<typeof commentSelect>;
export type CommentPayload = Static<typeof commentPayload>;
