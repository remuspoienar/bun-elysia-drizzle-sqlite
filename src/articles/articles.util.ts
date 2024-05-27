import type { User } from "../users/users.schema";
import type { Article } from "./articles.schema";

export function formattedArticle(
  a: Pick<
    Article,
    "slug" | "title" | "description" | "body" | "createdAt" | "updatedAt"
  > &
    Pick<User, "username" | "bio" | "image"> & {
      tagString: string;
    }
) {
  return {
    slug: a.slug,
    title: a.title,
    description: a.description,
    body: a.body,
    tagList: JSON.parse(a.tagString),
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    author: {
      username: a.username,
      bio: a.bio,
      image: a.image,
    },
  };
}
