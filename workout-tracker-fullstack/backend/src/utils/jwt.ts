import { sign } from "hono/jwt";

export async function createToken(userId: number, secret: string) {
  return await sign(
    { userId }, secret, "HS256"
  )
}