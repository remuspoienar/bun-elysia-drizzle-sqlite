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

// users
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
  followers: many(userFollows, { relationName: "followed" }),
  following: many(userFollows, { relationName: "follower" }),
  userFavorites: many(userFavorites),
}));

// articles
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
  userFavorites: many(userFavorites),
}));

// tags
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

// comments
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

// user follows
export const userFollows = sqliteTable(
  "userFollows",
  {
    followerId: integer("followerId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followedId: integer("followedId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  t => ({
    pk: primaryKey({ columns: [t.followerId, t.followedId] }),
  })
);

export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  follower: one(users, {
    fields: [userFollows.followerId],
    references: [users.id],
    relationName: "follower",
  }),
  followed: one(users, {
    fields: [userFollows.followedId],
    references: [users.id],
    relationName: "followed",
  }),
}));

// user favorites
export const userFavorites = sqliteTable(
  "userFavorites",
  {
    articleId: integer("articleId")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  t => ({
    pk: primaryKey({ columns: [t.articleId, t.userId] }),
  })
);

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  article: one(articles, {
    fields: [userFavorites.articleId],
    references: [articles.id],
  }),
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
}));
