import { eq } from "drizzle-orm";
import db from "../db/connection";
import { users } from "../db/schema";
import { unprocessable, unauthorized } from "../common/utils";

export abstract class UserService {
  static async create(body: typeof users.$inferInsert) {
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

  static update(id: number, data: Partial<typeof users.$inferInsert>) {
    try {
      return db.update(users).set(data).where(eq(users.id, id)).execute();
    } catch (e) {
      throw unprocessable(e);
    }
  }
}
