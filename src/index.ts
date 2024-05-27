import jwt from "@elysiajs/jwt";
import { Elysia, ValidationError } from "elysia";
import { unprocessable } from "./common/utils";
import usersController from "./users/users.controller";

const app = new Elysia({ prefix: "/api" })
  .onError(({ set, error }) => {
    set.headers["content-type"] = "application/json";
    if (error instanceof ValidationError) {
      /* attempting to return detailed error response while maintaing realworld api error response structure
    {"errors": {"body": [
              "Error in /user/username of type:string: Required property",
              "Error in /user/username of type:string: Expected string"
    ]} }*/
      try {
        return unprocessable(
          JSON.parse(error.message)["errors"].map(
            (o: Record<string, string>) =>
              `Error in ${o.path}${
                o.schema &&
                ` of ${Object.entries(o.schema).map((arr) => arr.join(" "))}`
              }: ${o.message}`
          )
        );
      } catch (e) {
        return unprocessable(error.message);
      }
    }
  })
  .use(usersController)
  .listen(3001);

export type App = typeof app;
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
