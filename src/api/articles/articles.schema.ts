import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t, type Static } from "elysia";
import { articles } from "../../db/schema";

export const articleInsert = createInsertSchema(articles);
export const articleSelect = createSelectSchema(articles);

export type ArticleInsert = Static<typeof articleInsert>;
export type Article = Static<typeof articleSelect>;

export const articleBase = t.Pick(articleInsert, [
  "title",
  "description",
  "body",
]);
export type ArticleBase = Static<typeof articleBase>;

export const articlePayload = t.Intersect([
  articleBase,
  t.Object({
    tagList: t.Optional(t.Array(t.String())),
  }),
]);

export type ArticlePayload = Static<typeof articlePayload>;

export const articleQuery = t.Object({
  author: t.Optional(t.String({ minLength: 1 })),
  tag: t.Optional(t.String({ minLength: 1 })),
  favorited: t.Optional(t.String({ minLength: 1 })),
  limit: t.Optional(t.Numeric({ minimum: 1 })),
  offset: t.Optional(t.Numeric({ minimum: 0 })),
});

export type ArticleQuery = Static<typeof articleQuery>;
