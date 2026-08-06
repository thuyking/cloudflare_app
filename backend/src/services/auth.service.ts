import type { LoginBody, RegisterBody } from "../models/user";
import { createUser, getUserByEmail } from "../repositories/auth.repository";
import { hashPassword } from "../utils/hash";
import { createToken } from "../utils/jwt";

export async function registerService(db: D1Database, body: RegisterBody) {
  if (!body.name?.trim()) {
    throw new Error("Name is required")
  }
  if (!body.email?.trim()) {
    throw new Error("Email is required")
  }
  if (!body.password) {
    throw new Error("Password is required")
  }
  if (body.password.length < 6) {
    throw new Error("Password too short")
  }
  const existing = await getUserByEmail(db, body.email)
  if (existing) {
    throw new Error("Email already exists")
  }
  const passwordHash = await hashPassword(body.password)
  await createUser(
    db,
    {
      name: body.name,
      email: body.email,
      password: passwordHash
    }
  )
}

export async function loginService(db: D1Database, body: LoginBody, secret: string) {
  const user = await getUserByEmail(db, body.email)
  if (!user) {
    throw new Error("Invaild email or password")
  }
  const passwordHash = await hashPassword(body.password)
  if (passwordHash !== user.password_hash) {
    throw new Error("Invaild email or password")
  }
  const token = await createToken(user.id, secret)
  return {
    id: user.id,
    token
  }
}
