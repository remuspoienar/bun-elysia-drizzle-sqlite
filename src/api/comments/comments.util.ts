import type { User } from "../users/users.schema";
import type { Comment } from "./comments.schema";

export function formattedComment(c: Comment & { author: User }) {
  const { id, createdAt, updatedAt, body } = c;
  const { username, bio, image } = c.author;
  return {
    id,
    createdAt,
    updatedAt,
    body,
    author: {
      username,
      bio,
      image,
    },
  };
}
