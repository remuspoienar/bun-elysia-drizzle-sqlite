import { sql } from "drizzle-orm";
import { isDefined } from "../../common/utils";
import {
  articles,
  tags,
  userFavorites,
  userFollows,
  users,
} from "../../db/schema";
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
      userFavorites: string;
    },
  currentUserId?: number
) {
  const tagList = [...new Set<string>(JSON.parse(a.tagString))].sort(
    (a: string, b: string) => (a < b ? -1 : 1)
  );

  const following =
    !!currentUserId &&
    !!(JSON.parse(a.userFollows) as number[]).find(id => id === currentUserId);

  const favorited =
    !!currentUserId &&
    !!(JSON.parse(a.userFavorites) as number[]).find(
      id => id === currentUserId
    );

  const favoritesCount = [
    ...new Set<number>(JSON.parse(a.userFavorites)),
  ].filter(isDefined).length;

  return {
    slug: a.slug,
    title: a.title,
    description: a.description,
    body: a.body,
    tagList,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    favorited,
    favoritesCount,
    author: {
      username: a.username,
      bio: a.bio,
      image: a.image,
      following,
    },
  };
}

export const articleFields = {
  id: articles.id,
  slug: articles.slug,
  title: articles.title,
  body: articles.body,
  description: articles.description,
  tagString: sql<string>`json_group_array(${tags.name})`.as("tags"),
  createdAt: articles.createdAt,
  updatedAt: articles.updatedAt,
  username: users.username,
  bio: users.bio,
  image: users.image,
  userFollows: sql<string>`json_group_array(${userFollows.followerId})`.as(
    "userFollows"
  ),
  userFavorites: sql<string>`json_group_array(${userFavorites.userId})`.as(
    "userFavorites"
  ),
};
