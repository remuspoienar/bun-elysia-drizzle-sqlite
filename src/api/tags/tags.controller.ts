import Elysia from "elysia";
import { TagService } from "./tags.service";

export const tagsController = new Elysia().get("/tags", () => {
  const tags = TagService.all().map(t => t.name);
  return { tags };
});

export default tagsController;
