import type { users } from "../db/schema";

export function formattedUser(user: typeof users.$inferSelect) {
  const { email, username, bio, image } = user;
  return { email, username, bio: bio, image: image };
}
