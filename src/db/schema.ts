import { relations, sql } from "drizzle-orm";
import {
  customType,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

const timestamp = customType<{
  data: Date;
  driverData: string;
}>({
  dataType() {
    return "datetime";
  },
  fromDriver(value: string): Date {
    return new Date(value);
  },
});

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true })
    .unique(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  bio: text("bio").default("https://api.realworld.io/images/smiley-cyrus.jpeg"),
  image: text("image"),
});

export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articles),
  comments: many(comments),
}));

export const articles = sqliteTable("articles", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true })
    .unique(),
  authorId: integer("authorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const articleRelations = relations(articles, ({ one, many }) => ({
  author: one(users, { fields: [articles.authorId], references: [users.id] }),
  comments: many(comments),
  tagsArticles: many(tagsArticles),
}));

export const tags = sqliteTable("tags", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true })
    .unique(),
  name: text("name").notNull().unique(),
});

export const tagRelations = relations(tags, ({ many }) => ({
  tagsArticles: many(tagsArticles),
}));

export const tagsArticles = sqliteTable(
  "tagsArticles",
  {
    tagId: integer("tagId")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    articleId: integer("articleId")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
  },
  t => ({
    pk: primaryKey({ columns: [t.tagId, t.articleId] }),
  })
);

export const tagsArticlesRelations = relations(tagsArticles, ({ one }) => ({
  tag: one(tags, { fields: [tagsArticles.tagId], references: [tags.id] }),
  article: one(articles, {
    fields: [tagsArticles.articleId],
    references: [articles.id],
  }),
}));

export const comments = sqliteTable("comments", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true })
    .unique(),
  authorId: integer("authorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  articleId: integer("articleId")
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const commentRelations = relations(comments, ({ one }) => ({
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
  }),
}));
