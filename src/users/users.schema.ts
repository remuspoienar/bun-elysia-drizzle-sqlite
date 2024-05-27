import { createInsertSchema } from "drizzle-typebox";
import { users } from "../db/schema";

export const TUserInsert = createInsertSchema(users);