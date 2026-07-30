import { Hono } from "hono";
import { Bindings, Variables } from "../type/binding";
import { authMiddleware } from "../middleware/auth";
import { createWorkout, deleteWorkout, getWorkout, getWorkoutById, updateWorkout } from "../repositories/workout.repository";
import { CreateWorkout, UpdateWorkout } from "../models/workout";
import { createWorkoutService, deleteWorkoutService, getWorkoutByIdService, getWorkoutsService, updateWorkoutService } from "../services/workout.service";

const workoutRoute = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();
workoutRoute.use("*", authMiddleware)
workoutRoute.get("/", async (c) => {
  const userId = c.get("userId");
  const workouts = await getWorkoutsService(c.env.workout_tracker_db, userId)
  return c.json(workouts)
})

workoutRoute.get("/:id", async (c) => {
  const workoutId = Number(c.req.param("id"))
  const userId = c.get("userId")
  const workout = await getWorkoutByIdService(c.env.workout_tracker_db, userId, workoutId)
  return c.json(workout)
})

workoutRoute.post("/", async (c) => {
  const userId = c.get("userId")
  const body = await c.req.json<CreateWorkout>()
  const workout = await createWorkoutService(c.env.workout_tracker_db, userId, body)
  return c.json({
    message: "Create success",
    data: workout
  })
})

workoutRoute.put("/:id", async (c) => {
  const workoutId = Number(c.req.param("id"))
  const userId = c.get("userId")
  const body = await c.req.json<UpdateWorkout>()
  const workout = await updateWorkoutService(c.env.workout_tracker_db, userId, workoutId, body)
  return c.json({
    message: "Update success",
    data: workout
  })
})
workoutRoute.delete("/:id", async (c) => {
  const workoutId = Number(c.req.param("id"))
  const userId = c.get("userId")
  const workout = await deleteWorkoutService(c.env.workout_tracker_db, userId, workoutId)
  return c.json({
    message: "Delete success",
  })
})
export default workoutRoute

