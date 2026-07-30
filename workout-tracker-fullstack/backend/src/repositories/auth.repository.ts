import { RegisterBody, UserRow } from "../models/user";

export async function getUserByEmail(db: D1Database, email: string) {
  const result = await db.prepare('select * from user where email = ?').bind(email).first<UserRow>();
  return result;
}

export async function createUser(db: D1Database, body: RegisterBody) {
  await db.prepare("insert into user(name, email, password_hash) values(?, ?, ?)").bind(body.name, body.email, body.password).run()
}

