import type { User } from "../users/users.schema";
import type { Article } from "./articles.schema";

export function formattedArticle(
  a: Pick<
    Article,
    "slug" | "title" | "description" | "body" | "createdAt" | "updatedAt"
  > &
    Pick<User, "username" | "bio" | "image"> & {
      tagString: string;
      userFollows: string;
    },
  currentUserId?: number
) {
  const tagList = [...new Set<string>(JSON.parse(a.tagString))].sort(
    (a: string, b: string) => (a < b ? -1 : 1)
  );

  const following = currentUserId
    ? (JSON.parse(a.userFollows) as number[]).findIndex(
        id => id === currentUserId
      ) !== -1
    : false;

  return {
    slug: a.slug,
    title: a.title,
    description: a.description,
    body: a.body,
    tagList,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    author: {
      username: a.username,
      bio: a.bio,
      image: a.image,
      following,
    },
  };
}
