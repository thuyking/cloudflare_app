import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";

import { createWorkoutPlan, deleteWorkoutPlan, getWorkoutPlan, getWorkoutPlanById } from "../repositories/workout_plan.repository";
import { Bindings, Variables } from "../type/binding";
import { CreateWorkoutPlanBody } from "../models/workout";
import { togglePlanExerciseService } from "../services/workout_plan.service";

const workoutPlanRoute = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();
workoutPlanRoute.use("*", authMiddleware)
workoutPlanRoute.get("/", async (c) => {
  const userId = c.get("userId");
  const workoutPlan = await getWorkoutPlan(c.env.workout_tracker_db, userId);
  return c.json(workoutPlan);
})

workoutPlanRoute.post("/", async (c) => {
  const userId = c.get("userId")
  const body = await c.req.json<CreateWorkoutPlanBody>()
  await createWorkoutPlan(c.env.workout_tracker_db, userId, body)
  return c.json({
    message: "Create success"
  })
})

workoutPlanRoute.get("/:id", async (c) => {
  const userId = c.get("userId");
  const planId = Number(c.req.param("id"));
  const result = await getWorkoutPlanById(c.env.workout_tracker_db, userId, planId)
  return c.json(result)
})

workoutPlanRoute.patch("/:planId/exercises/:exerciseId/toggle", async (c) => {
  const userId = c.get("userId");
  console.log("DEBUG userId:", userId);
  const result = await togglePlanExerciseService(
    c.env.workout_tracker_db,
    c.get("userId"),
    Number(c.req.param("planId")),
    Number(c.req.param("exerciseId"))
  )
  return c.json({
    message: "Toggle exercises success",
    data: result
  })
})

workoutPlanRoute.delete("/:planId", async (c) => {
  const result = await deleteWorkoutPlan(c.env.workout_tracker_db, c.get("userId"), Number(c.req.param("planId")))
  return c.json(result)
})
export default workoutPlanRoute;

