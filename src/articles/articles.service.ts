import { desc, eq, like, sql } from "drizzle-orm";
import { isDefined, notFound, toSlug, unprocessable } from "../common/utils";
import db from "../db/connection";
import { articles, tags, tagsArticles, users } from "../db/schema";
import { TagService } from "../tags/tags.service";
import type {
  ArticleBase,
  ArticleInsert,
  ArticlePayload,
  ArticleQuery
} from "./articles.schema";
import { formattedArticle } from "./articles.util";

const allArticleFields = {
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
};

export abstract class ArticleService {
  static create(userId: number, articlePayload: ArticlePayload) {
    const { tagList, ...article } = articlePayload;
    const values: ArticleInsert[] = [
      {
        ...article,
        authorId: userId,
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

        return this.get(res.slug);
      });
    } catch (e) {
      throw unprocessable(e);
    }
  }

  static get(slug: string) {
    const article = db
      .select(allArticleFields)
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1)
      .leftJoin(tagsArticles, eq(tagsArticles.articleId, articles.id))
      .leftJoin(tags, eq(tagsArticles.tagId, tags.id))
      .innerJoin(users, eq(articles.authorId, users.id))
      .get();

    if (!article?.slug) {
      throw notFound();
    }

    return formattedArticle(article);
  }

  static getList(q: ArticleQuery) {
    const { author: userName, tag: tagName } = q;

    const query = db
      .select(allArticleFields)
      .from(articles)
      .leftJoin(tagsArticles, eq(tagsArticles.articleId, articles.id))
      .leftJoin(tags, eq(tagsArticles.tagId, tags.id))
      .innerJoin(users, eq(articles.authorId, users.id));

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
      .map(formattedArticle);
  }

  static update(slug: string, data: Partial<ArticleBase>) {
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

    db.update(articles)
      .set(newValues)
      .where(eq(articles.id, article.id))
      .execute();

    return this.get(newValues.slug || article.slug);
  }

  static delete(slug: string) {
    db.delete(articles).where(eq(articles.slug, slug)).execute();
  }
}
