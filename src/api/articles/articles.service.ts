import { and, desc, eq, like } from "drizzle-orm";
import { isDefined, notFound, toSlug, unprocessable } from "../../common/utils";
import db from "../../db/connection";
import {
  articles,
  tags,
  tagsArticles,
  userFavorites,
  userFollows,
  users,
} from "../../db/schema";
import { formatProfile } from "../profiles/profiles.utils";
import { TagService } from "../tags/tags.service";
import type {
  ArticleBase,
  ArticleInsert,
  ArticlePayload,
  ArticleQuery,
} from "./articles.schema";
import { articleFields, formattedArticle } from "./articles.util";

export abstract class ArticleService {
  static create(articlePayload: ArticlePayload, currentUserId: number) {
    const { tagList, ...article } = articlePayload;
    const values: ArticleInsert[] = [
      {
        ...article,
        authorId: currentUserId,
        slug: toSlug(article.title),
      },
    ];
    try {
      return db.transaction(tx => {
        const res = tx.insert(articles).values(values).returning().get();
        if (isDefined(tagList) && tagList.length > 0) {
          const tags = TagService.findOrCreate(tagList, tx);
          TagService.createLink(res.id, tags, tx);
        }

        return this.get(res.slug, currentUserId);
      });
    } catch (e) {
      throw unprocessable(e);
    }
  }

  static get(slug: string, currentUserId?: number) {
    const article = db.query.articles
      .findFirst({
        where: eq(articles.slug, slug),
        with: {
          author: { with: { followers: true } },
          tagsArticles: {
            with: {
              tag: true,
            },
          },
          userFavorites: true,
        },
      })
      .sync();

    if (!article?.slug) {
      throw notFound();
    }

    const author = formatProfile(article.author);

    const tagList = article.tagsArticles
      .map(ta => ta.tag.name)
      .sort((a, b) => (a < b ? -1 : 1));

    const favorited =
      !!currentUserId &&
      !!article.userFavorites.find(fav => fav.userId === currentUserId);

    const favoritesCount = article.userFavorites.length;

    return {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      favorited,
      favoritesCount,
      tagList,
      author,
    };
  }

  static getFeed(
    q: Pick<ArticleQuery, "offset" | "limit">,
    currentUserId: number
  ) {
    const { limit, offset } = q;

    return db
      .select(articleFields)
      .from(articles)
      .leftJoin(tagsArticles, eq(tagsArticles.articleId, articles.id))
      .innerJoin(tags, eq(tagsArticles.tagId, tags.id))
      .innerJoin(users, eq(articles.authorId, users.id))
      .leftJoin(userFollows, eq(userFollows.followedId, users.id))
      .leftJoin(userFavorites, eq(userFavorites.articleId, articles.id))
      .where(eq(userFollows.followerId, currentUserId))
      .limit(limit || 20)
      .offset(offset || 0)
      .groupBy(articles.id)
      .orderBy(desc(articles.createdAt))
      .all()
      .map(row => formattedArticle(row, currentUserId));
  }

  static getList(q: ArticleQuery, currentUserId?: number) {
    const { author: userName, tag: tagName, limit, offset } = q;

    const query = db
      .select(articleFields)
      .from(articles)
      .leftJoin(tagsArticles, eq(tagsArticles.articleId, articles.id))
      .innerJoin(tags, eq(tagsArticles.tagId, tags.id))
      .innerJoin(users, eq(articles.authorId, users.id))
      .leftJoin(userFollows, eq(userFollows.followedId, users.id))
      .leftJoin(userFavorites, eq(userFavorites.articleId, articles.id))
      .limit(limit || 20)
      .offset(offset || 0);

    if (isDefined(userName)) {
      query.where(eq(users.username, userName));
    }

    if (isDefined(tagName)) {
      // @ts-expect-error - tagString inferred type doesnt play nice with "like"
      query.having(({ tagString }) => like(tagString, `%"${tagName}"%`));
    }

    return query
      .groupBy(articles.id)
      .orderBy(desc(articles.createdAt))
      .all()
      .map(row => formattedArticle(row, currentUserId));
  }

  static update(
    slug: string,
    data: Partial<ArticleBase>,
    currentUserId?: number
  ) {
    const article = db.query.articles
      .findFirst({ where: eq(articles.slug, slug) })
      .sync();

    if (!article?.slug) {
      throw notFound();
    }
    const { title, body, description } = data;
    const newValues = {
      ...(title && { title, slug: toSlug(title) }),
      ...(body && { body }),
      ...(description && { description }),
    };

    db.update(articles).set(newValues).where(eq(articles.id, article.id)).run();

    return this.get(newValues.slug || article.slug, currentUserId);
  }

  static delete(slug: string) {
    db.delete(articles).where(eq(articles.slug, slug)).run();
  }

  static addFavorite(slug: string, currentUserId: number) {
    const article = db.query.articles
      .findFirst({
        where: eq(articles.slug, slug),
      })
      .sync();

    if (!article?.slug) {
      throw notFound();
    }

    try {
      db.insert(userFavorites)
        .values([{ articleId: article.id, userId: currentUserId }])
        .run();
      return this.get(slug, currentUserId);
    } catch (e) {
      return this.get(slug, currentUserId);
    }
  }

  static removeFavorite(slug: string, currentUserId: number) {
    const article = db.query.articles
      .findFirst({
        where: eq(articles.slug, slug),
      })
      .sync();

    if (!article?.slug) {
      throw notFound();
    }

    db.delete(userFavorites)
      .where(
        and(
          eq(userFavorites.articleId, article.id),
          eq(userFavorites.userId, currentUserId)
        )
      )
      .run();

    return this.get(slug, currentUserId);
  }
}
