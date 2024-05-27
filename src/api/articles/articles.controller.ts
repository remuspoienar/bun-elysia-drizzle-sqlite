import { Elysia, t } from "elysia";
import jwt from "../../common/jwt";
import { getAuthUserId, unauthorized } from "../../common/utils";
import { articleBase, articlePayload, articleQuery } from "./articles.schema";
import { ArticleService } from "./articles.service";

export const articlesController = new Elysia({ prefix: "/articles" })
  .use(jwt)
  .resolve(async ({ headers, jwt }) => {
    try {
      const data = await getAuthUserId({ headers, jwt });
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
      query: t.Partial(articleQuery),
    }
  )
  .get(
    ":slug",
    ({ params, userId }) => {
      const article = ArticleService.get(params.slug, userId);
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
        .get(
          "feed",
          ({ userId, query }) => {
            const articles = ArticleService.getFeed(query, userId);
            return { articles, articlesCount: articles.length };
          },
          {
            query: t.Partial(t.Pick(articleQuery, ["limit", "offset"])),
          }
        )
        .post(
          "",
          ({ userId, body, set }) => {
            const article = ArticleService.create(body.article, userId);
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
          ({ userId, params, body }) => {
            const article = ArticleService.update(
              params.slug,
              body.article,
              userId
            );
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
        .post(
          ":slug/favorite",
          ({ userId, params }) => {
            const article = ArticleService.addFavorite(params.slug, userId);
            return { article };
          },
          {
            params: t.Object({
              slug: t.String(),
            }),
          }
        )
        .delete(
          ":slug/favorite",
          ({ userId, params }) => {
            const article = ArticleService.removeFavorite(params.slug, userId);
            return { article };
          },
          {
            params: t.Object({
              slug: t.String(),
            }),
          }
        )
  );

export default articlesController;
