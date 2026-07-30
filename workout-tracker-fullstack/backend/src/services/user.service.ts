
// import { User } from "../Models/user";
// import { createUser } from "../repositories/user.repository";

// export async function createUserService(db: D1Database, body: User) {
//   if (!body.name) {
//     throw new Error("Name is required");
//   }
//   if (!body.age || body.age < 0) {
//     throw new Error("Age is invaild");
//   }
//   await createUser(db, body);
// }