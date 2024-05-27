import { Elysia, t } from "elysia";
import jwt from "../../common/jwt";
import { getAuthUserId, unauthorized } from "../../common/utils";
import { commentPayload } from "./comments.schema";
import { CommentService } from "./comments.service";

export const commentsController = new Elysia({
  prefix: "/articles/:slug/comments",
})
  .use(jwt)
  .get(
    "",
    ({ params }) => {
      const comments = CommentService.getForArticle(params.slug);
      return { comments };
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
          ({ userId, params, body, set }) => {
            const comment = CommentService.create(
              userId,
              params.slug,
              body.comment
            );
            set.status = 201;
            return { comment };
          },
          {
            params: t.Object({
              slug: t.String(),
            }),
            body: t.Object({
              comment: commentPayload,
            }),
          }
        )
        .delete(
          ":id",
          ({ params, set }) => {
            CommentService.delete(params.id);
            set.status = 204;
          },
          {
            params: t.Object({
              slug: t.String(),
              id: t.Numeric(),
            }),
          }
        )
  );

export default commentsController;
