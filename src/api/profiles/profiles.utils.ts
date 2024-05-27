import type { User } from "../users/users.schema";
import type { UserFollow } from "./profiles.schema";

export function formatProfile(
  user: User & { followers: UserFollow[] },
  currentUserId?: number
) {
  const { username, bio, image } = user;
  const following = currentUserId
    ? user.followers?.findIndex(
        record => record.followerId === currentUserId
      ) !== -1
    : false;
  return { username, bio, image, following };
}
