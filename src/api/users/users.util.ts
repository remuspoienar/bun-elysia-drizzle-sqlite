import type { User } from "./users.schema";

export function formattedUser(user: User) {
  const { email, username, bio, image } = user;
  return { email, username, bio: bio, image: image };
}
