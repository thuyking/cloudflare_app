// import { Hono } from "hono";
// import { Bindings } from "../type/binding";
// import { createUser, deleteALlUser, deleteUser, getUser, getUserById, updateUser } from "../repositories/user.repository";
// import { createUserService } from "../services/user.service";
// import { User } from "../Models/user";

// const userRouter = new Hono<{ Bindings: Bindings }>()
// userRouter.get('/', async (c) => {
//   const result = await getUser(c.env.workout_tracker_db)
//   return c.json(result)
// })
// userRouter.post("/", async (c) => {
//   try {
//     const body = await c.req.json<User>()
//     await createUserService(c.env.workout_tracker_db, body)
//     return c.json({
//       message: "Create success"
//     })
//   } catch (error) {
//     return c.json({
//       message: error instanceof Error ? error.message : "Unknow error"
//     }, 400)
//   }
// })
// userRouter.put("/:id", async (c) => {
//   const id = Number(c.req.param("id"))
//   const body = await c.req.json<User>()
//   await updateUser(c.env.workout_tracker_db, body, id)
//   return c.json({ message: "Update success" })
// })

// userRouter.get("/:id", async (c) => {
//   const id = Number(c.req.param("id"))
//   const result = await getUserById(c.env.workout_tracker_db, id)
//   return c.json(result)
// })


// userRouter.delete("/:id", async (c) => {
//   const id = Number(c.req.param("id"))
//   await deleteUser(c.env.workout_tracker_db, id)
//   return c.json({ message: "Delete success" })
// })
// userRouter.delete("/", async (c) => {
//   await deleteALlUser(c.env.workout_tracker_db)
//   return c.json({ message: "Delete success" })
// })
// export default userRouter