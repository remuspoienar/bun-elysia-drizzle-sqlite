import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true })
    .unique(),
  email: text("email").notNull().unique(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  bio: text("bio"),
  image: text("image"),
});

// export const usersRelations = relations(users, ({ many }) => ({
//     posts: many(posts),
//   }));
//   export const posts = pgTable('posts', {
//     id: serial('id').primaryKey(),
//     content: text('content').notNull(),
//     authorId: integer('author_id').notNull(),
//   });
//   export const postsRelations = relations(posts, ({ one }) => ({
//     author: one(users, { fields: [posts.authorId], references: [users.id] }),
//   }));
