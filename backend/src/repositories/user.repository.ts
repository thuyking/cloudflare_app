// import { User } from "../Models/user";

// export async function getUser(db: D1Database) {
//   const result = await db.prepare("select * from user").all();
//   return result.results
// }

// export async function createUser(db: D1Database, body: User) {
//   await db.prepare("insert into user(id, name, age) values(?, ?, ?)").bind(body.id, body.name, body.age).run();
// }

// export async function getUserById(db: D1Database, id: number) {
//   const result = await db.prepare(`
//     Select * from user where id = ?
//   `).bind(id).first();
//   return result
// }

// export async function updateUser(db: D1Database, body: User, id: number) {
//   await db.prepare(
//     `
//     update user
//     set age = ?, name = ?
//     where id = ?
//     `
//   ).bind(body.age, body.name, id).run();
// }

// export async function deleteUser(db: D1Database, id: number) {
//   await db.prepare("delete from user where id = ?").bind(id).run()
// }


// export async function deleteALlUser(db: D1Database) {
//   await db.prepare("delete from user").run()
// }