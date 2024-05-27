import { eq } from "drizzle-orm";
import { unauthorized, unprocessable } from "../../common/utils";
import db from "../../db/connection";
import { users } from "../../db/schema";
import type { UserInsert } from "./users.schema";

export abstract class UserService {
  static async create(body: UserInsert) {
    body.password = await Bun.password.hash(body.password);
    try {
      const res = await db.insert(users).values(body).returning();
      return res;
    } catch (e) {
      throw unprocessable(e);
    }
  }

  static async authenticate(email: string, password: string) {
    const user = db.query.users
      .findFirst({
        where: eq(users.email, email),
      })
      .sync();
    if (!user) throw unauthorized();

    const isMatch = await Bun.password.verify(password, user.password);

    if (!isMatch) throw unauthorized();

    return user;
  }

  static find(id: number) {
    return db.query.users
      .findFirst({
        where: eq(users.id, id),
      })
      .sync();
  }

  static update(id: number, data: Partial<UserInsert>) {
    try {
      return db.update(users).set(data).where(eq(users.id, id)).run();
    } catch (e) {
      throw unprocessable(e);
    }
  }

  static findByUsername(username: string) {
    return db.query.users
      .findFirst({
        where: eq(users.username, username),
      })
      .sync();
  }
}
