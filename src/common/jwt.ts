import elysisaJwt from "@elysiajs/jwt";

const jwt = elysisaJwt({
  name: "jwt",
  secret: Bun.env.JWT_SECRET || "realsecret",
  exp: "7d",
});

export default jwt;

export type JwtContext = { jwt: (typeof jwt)["decorator"]["jwt"] };
