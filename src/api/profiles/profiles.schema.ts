import { createSelectSchema } from "drizzle-typebox";
import type { Static } from "elysia";
import { userFollows } from "../../db/schema";
import type { User } from "../users/users.schema";

export type Profile = Pick<User, "username" | "bio" | "image">;

export const userFollow = createSelectSchema(userFollows);

export type UserFollow = Static<typeof userFollow>;
