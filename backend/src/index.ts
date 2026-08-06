import { Hono } from "hono";
import type { Bindings } from "./type/binding";
// import userRouter from "./routes/user.routes";
import authRoute from "./routes/auth.route";
import workoutRoute from "./routes/workout.route";
import workoutPlanRoute from "./routes/workout_plan.routes";
import { cors } from "hono/cors";


const app = new Hono<{ Bindings: Bindings }>();
app.use("*", cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8787",
    "https://cloudflare-app-660.pages.dev",
    "https://7f67d40f.cloudflare-app-660.pages.dev",
  ],
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}))

app.get("/health", async (c) => {
  return c.json({
    status: "ok",
    appName: c.env.APP_NAME,
    environment: c.env.ENVIRONMENT
  })
})
app.get("/", async (c) => {
  return c.text("Hello World!")
})
// app.route("/user", userRouter)

app.route("/auth", authRoute)
app.route("/workouts", workoutRoute)
app.route("/plan", workoutPlanRoute)
export default app;
