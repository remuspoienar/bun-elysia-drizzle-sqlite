import type { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import db from "../../db/connection";

import { tags, tagsArticles } from "../../db/schema";
import type { Tag } from "./tags.schema";

export abstract class TagService {
  static findOrCreate(
    tagList: string[],
    tx?: SQLiteTransaction<"sync", void, any, any>
  ): Tag[] {
    const existingTags = db.query.tags
      .findMany({
        where: (tags, { inArray }) => inArray(tags.name, tagList),
      })
      .sync();

    const existingTagNames = existingTags.map(row => row.name);
    const nonExistingTags = tagList.filter(t => !existingTagNames.includes(t));

    if (nonExistingTags.length === 0) return existingTags;

    const newTags = (tx || db)
      .insert(tags)
      .values(nonExistingTags.map(t => ({ name: t })))
      .returning()
      .all();

    return [...existingTags, ...newTags];
  }

  static createLink(
    articleId: number,
    tags: Tag[],
    tx?: SQLiteTransaction<"sync", void, any, any>
  ) {
    return (tx || db)
      .insert(tagsArticles)
      .values(tags.map(t => ({ articleId, tagId: t.id })))
      .returning()
      .get();
  }

  static all() {
    return db.query.tags.findMany().sync();
  }
}
