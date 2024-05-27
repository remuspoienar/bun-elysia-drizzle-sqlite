import { describe, expect, it } from "bun:test";
import { app } from "../src";

describe("Articles requests", () => {
  it("signs up a user, create an article and fetch it", async () => {
    const data = await app
      .handle(
        new Request("localhost:3001/api/users", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            user: {
              username: "michaeljp",
              email: "michaeljp@realworld.com",
              password: "Test123",
            },
          }),
        })
      )
      .then(resp => resp.json());

    const token = data.user.token;

    const articlePayload = {
      title: "How to train your dragon",
      description: "Ever wonder how?",
      body: "Very carefully.",
      tagList: ["dragons", "training"],
    };

    const createArticleResponse = await app.handle(
      new Request("localhost:3001/api/articles", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Token ${token}`,
        },
        body: JSON.stringify({ article: articlePayload }),
      })
    );
    expect(createArticleResponse.status).toEqual(201);

    const { article: createdArticle } = await createArticleResponse.json();

    expect(createdArticle.title).toEqual(articlePayload.title);
    expect(createdArticle.description).toEqual(articlePayload.description);
    expect(createdArticle.body).toEqual(articlePayload.body);
    expect(createdArticle.tagList).toEqual(articlePayload.tagList);

    const allArticlesResponse = await app.handle(
      new Request("localhost:3001/api/articles", {
        headers: {
          "content-type": "application/json",
        },
      })
    );
    expect(allArticlesResponse.status).toEqual(200);

    const { articles } = await allArticlesResponse.json();

    expect(articles[0]).toMatchObject(createdArticle);
  });
});
