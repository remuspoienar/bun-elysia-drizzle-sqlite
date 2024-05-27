import { and, eq } from "drizzle-orm";
import { notFound } from "../../common/utils";
import db from "../../db/connection";
import { userFollows, users } from "../../db/schema";
import { formatProfile } from "./profiles.utils";

export abstract class ProfileService {
  static get(username: string, currentUserId?: number) {
    const profile = db.query.users
      .findFirst({
        where: eq(users.username, username),
        with: { followers: true },
      })
      .sync();

    return profile && formatProfile(profile, currentUserId);
  }

  static follow(username: string, currentUserId: number) {
    const followedUser = db.query.users
      .findFirst({ where: eq(users.username, username) })
      .sync();

    if (!followedUser) throw notFound();

    try {
      db.insert(userFollows)
        .values([{ followerId: currentUserId, followedId: followedUser.id }])
        .run();

      return this.get(username, currentUserId);
    } catch (e) {
      return this.get(username, currentUserId);
    }
  }

  static unfollow(username: string, currentUserId: number) {
    const followedUser = db.query.users
      .findFirst({ where: eq(users.username, username) })
      .sync();

    if (!followedUser) throw notFound();

    db.delete(userFollows)
      .where(
        and(
          eq(userFollows.followerId, currentUserId),
          eq(userFollows.followedId, followedUser.id)
        )
      )
      .run();

    return this.get(username, currentUserId);
  }
}
