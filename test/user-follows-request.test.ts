import { describe, expect, it } from "bun:test";
import { app } from "../src";

describe("User follows requests", () => {
  it("signs up 3 users, which follow and unfollow each other", async () => {
    const userData1 = await app
      .handle(
        new Request("localhost:3001/api/users", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            user: {
              username: "michael",
              email: "michael@realworld.com",
              password: "Test123",
            },
          }),
        })
      )
      .then(resp => resp.json());

    const tokenMichael = userData1.user.token;

    const userData2 = await app
      .handle(
        new Request("localhost:3001/api/users", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            user: {
              username: "jason",
              email: "jason@realworld.com",
              password: "Test123",
            },
          }),
        })
      )
      .then(resp => resp.json());

    const tokenJason = userData2.user.token;

    const userData3 = await app
      .handle(
        new Request("localhost:3001/api/users", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            user: {
              username: "bob",
              email: "bob@realworld.com",
              password: "Test123",
            },
          }),
        })
      )
      .then(resp => resp.json());

    const tokenBob = userData3.user.token;

    // michael follows both jason and bob
    const profiles1 = await Promise.all(
      ["jason", "bob"].map(username =>
        app
          .handle(
            new Request(`localhost:3001/api/profiles/${username}/follow`, {
              method: "POST",
              headers: {
                "content-type": "application/json",
                authorization: `Token ${tokenMichael}`,
              },
            })
          )
          .then(resp => resp.json())
      )
    );

    expect(profiles1[0].profile.following).toBeTrue();
    expect(profiles1[1].profile.following).toBeTrue();

    // jason follows back michael, and follows jason
    const profiles2 = await Promise.all(
      ["michael", "jason"].map(username =>
        app
          .handle(
            new Request(`localhost:3001/api/profiles/${username}/follow`, {
              method: "POST",
              headers: {
                "content-type": "application/json",
                authorization: `Token ${tokenJason}`,
              },
            })
          )
          .then(resp => resp.json())
      )
    );

    expect(profiles2[0].profile.following).toBeTrue();
    expect(profiles2[1].profile.following).toBeTrue();

    // bob follows michael only
    const profile3 = await app
      .handle(
        new Request("localhost:3001/api/profiles/michael/follow", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Token ${tokenBob}`,
          },
        })
      )
      .then(resp => resp.json());

    expect(profile3.profile.following).toBeTrue();

    // michael unfollows jason
    const profile4 = await app
      .handle(
        new Request(`localhost:3001/api/profiles/jason/follow`, {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            authorization: `Token ${tokenMichael}`,
          },
        })
      )
      .then(resp => resp.json());

    expect(profile4.profile.following).toBeFalse();

    // checking that jason still follows michael
    const profile5 = await app
      .handle(
        new Request(`localhost:3001/api/profiles/michael`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            authorization: `Token ${tokenJason}`,
          },
        })
      )
      .then(resp => resp.json());

    expect(profile5.profile.following).toBeTrue();
  });
});
