import { eq } from "drizzle-orm";
import { isDefined, notFound, unprocessable } from "../../common/utils";
import db from "../../db/connection";
import { articles, comments } from "../../db/schema";
import type { CommentInsert, CommentPayload } from "./comments.schema";
import { formattedComment } from "./comments.util";

export abstract class CommentService {
  static create(userId: number, slug: string, commentPayload: CommentPayload) {
    try {
      const article = db.query.articles
        .findFirst({ where: eq(articles.slug, slug) })
        .sync();

      if (!isDefined(article)) throw notFound();

      const record: CommentInsert = {
        articleId: article.id,
        authorId: userId,
        body: commentPayload.body,
      };
      const { id } = db
        .insert(comments)
        .values([record])
        .returning({ id: comments.id })
        .get();
      return this.get(id);
    } catch (e) {
      throw unprocessable(e);
    }
  }

  static get(id: number) {
    const comment = db.query.comments
      .findFirst({
        where: eq(comments.id, id),
        with: {
          author: true,
        },
      })
      .sync();
    if (!isDefined(comment)) throw notFound();

    return formattedComment(comment);
  }

  static getForArticle(slug: string) {
    const article = db.query.articles
      .findFirst({ where: eq(articles.slug, slug) })
      .sync();

    if (!isDefined(article)) throw notFound();

    const commentList = db.query.comments
      .findMany({
        where: eq(comments.articleId, article.id),
        with: {
          author: true,
        },
      })
      .sync();

    return commentList.map(formattedComment);
  }

  static delete(id: number) {
    db.delete(comments).where(eq(comments.id, id)).run();
  }
}
