import { error, type Context } from "elysia";
import { type JwtContext } from "./jwt";

export async function getAuthUserId({
  headers: { authorization },
  jwt,
}: Context & JwtContext) {
  const token = authorization?.replace("Token ", "");
  const payload = await jwt.verify(token);
  if (!payload) {
    throw unauthorized();
  }

  return { userId: +payload.id, token };
}

export function unauthorized(cause?: any) {
  return error(401, {
    errors: { body: [cause ? `${cause}` : "Invalid credentials"] },
  });
}

export function unprocessable(cause?: any) {
  return error(422, {
    errors: {
      body:
        cause?.length || 0 > 0
          ? cause
          : [cause ? `${cause}` : "Validation failed, check parameters"],
    },
  });
}

export function notFound(cause?: any) {
  return error(404, {
    errors: { body: [cause ? `${cause}` : "Invalid resource identifier"] },
  });
}
