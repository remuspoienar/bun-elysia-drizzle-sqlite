import { Elysia, t } from "elysia";
import jwt from "../../common/jwt";
import { getAuthUserId, unauthorized } from "../../common/utils";
import { articleBase, articlePayload } from "./articles.schema";
import { ArticleService } from "./articles.service";

export const articlesController = new Elysia({ prefix: "/articles" })
  .use(jwt)
  .resolve(async ctx => {
    try {
      const data = await getAuthUserId(ctx);
      return data;
    } catch (e) {
      return { userId: undefined, token: undefined };
    }
  })
  .get(
    "",
    ({ query, userId }) => {
      const articles = ArticleService.getList(query, userId);
      return { articles, articlesCount: articles.length };
    },
    {
      query: t.Partial(
        t.Object({
          author: t.String({ minLength: 1 }),
          tag: t.String({ minLength: 1 }),
          favorited: t.String({ minLength: 1 }),
        })
      ),
    }
  )
  .get(
    ":slug",
    ({ params }) => {
      const article = ArticleService.get(params.slug);
      return { article };
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
    }
  )
  .guard(
    {
      beforeHandle({ headers: { authorization, ...headers } }) {
        if (!authorization || authorization.toString() === "") {
          throw unauthorized();
        }
      },
    },
    app =>
      app
        .resolve(getAuthUserId)
        .post(
          "",
          ({ userId, body, set }) => {
            const article = ArticleService.create(userId, body.article);
            set.status = 201;
            return { article };
          },
          {
            body: t.Object({
              article: articlePayload,
            }),
          }
        )
        .put(
          ":slug",
          ({ params, body }) => {
            const article = ArticleService.update(params.slug, body.article);
            return { article };
          },
          {
            params: t.Object({
              slug: t.String(),
            }),
            body: t.Object({
              article: t.Partial(articleBase),
            }),
          }
        )
        .delete(
          ":slug",
          ({ params, set }) => {
            ArticleService.delete(params.slug);
            set.status = 204;
          },
          {
            params: t.Object({
              slug: t.String(),
            }),
          }
        )
  );

export default articlesController;
