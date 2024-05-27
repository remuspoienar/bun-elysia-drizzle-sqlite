import { Elysia, t } from "elysia";
import jwt from "../common/jwt";
import { getAuthUserId, notFound } from "../common/utils";
import { TUserInsert } from "./users.schema";
import { UserService } from "./users.service";
import { formattedUser } from "./users.util";

const usersController = new Elysia()
  .use(jwt)
  .post(
    "users",
    async ({ body, jwt }) => {
      const [user] = await UserService.create(body.user);

      const token = await jwt.sign({ id: user.id });
      return { user: { ...formattedUser(user), token } };
    },
    {
      body: t.Object({
        user: t.Pick(TUserInsert, ["email", "username", "password"]),
      }),
    }
  )
  .post(
    "users/login",
    async ({ body, jwt }) => {
      const { email, password } = body.user;

      const user = await UserService.authenticate(email, password);
      const token = await jwt.sign({ id: user.id });
      return { user: { ...formattedUser(user), token } };
    },
    {
      body: t.Object({ user: t.Pick(TUserInsert, ["email", "password"]) }),
    }
  )
  .guard(
    {
      headers: t.Object({
        authorization: t.TemplateLiteral("Token ${string}"),
      }),
    },
    (app) =>
      app
        .resolve(getAuthUserId)
        .get("user", async ({ userId, token }) => {
          const user = UserService.find(userId);
          if (!user) {
            throw notFound();
          }
          return { user: { ...formattedUser(user!), token } };
        })
        .put(
          "user",
          async ({ body, userId, token }) => {
            const { username, bio, image, email } = body.user;
            await UserService.update(userId, {
              username,
              bio,
              image,
              email,
            });
            const user = UserService.find(userId);
            return { user: { ...formattedUser(user!), token } };
          },
          {
            body: t.Object({
              user: t.Partial(
                t.Pick(TUserInsert, ["username", "bio", "image", "email"])
              ),
            }),
          }
        )
  );

export default usersController;
