import { Elysia, t } from "elysia";
import jwt from "../../common/jwt";
import { getAuthUserId, notFound, unauthorized } from "../../common/utils";
import { userInsert } from "./users.schema";
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
        user: t.Pick(userInsert, ["email", "username", "password"]),
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
      body: t.Object({ user: t.Pick(userInsert, ["email", "password"]) }),
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
        .get("user", ({ userId, token }) => {
          const user = UserService.find(userId);
          if (!user) {
            throw notFound();
          }
          return { user: { ...formattedUser(user!), token } };
        })
        .put(
          "user",
          ({ body, userId, token }) => {
            const { username, bio, image, email } = body.user;
            UserService.update(userId, {
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
                t.Pick(userInsert, ["username", "bio", "image", "email"])
              ),
            }),
          }
        )
  );

export default usersController;
