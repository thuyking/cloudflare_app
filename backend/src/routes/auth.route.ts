import { Hono } from "hono";
import type { Bindings } from "../type/binding";
import type { LoginBody, RegisterBody } from "../models/user";
import { loginService, registerService } from "../services/auth.service";

const authRoute = new Hono<{ Bindings: Bindings }>()

authRoute.post('/register', async (c) => {
  try {
    const body = await c.req.json<RegisterBody>()
    await registerService(c.env.workout_tracker_db, body)
    return c.json({
      message: "Register success"
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Register failed"
    if (message === "Email already exists") {
      return c.json({ message }, 409)
    }
    return c.json({ message }, 400)
  }
})

authRoute.post("/login", async (c) => {
  try {
    const body = await c.req.json<LoginBody>();
    const user = await loginService(c.env.workout_tracker_db, body, c.env.JWT_SECRET);
    return c.json(user)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed"
    if (message === "Invaild email or password") {
      return c.json({ message }, 401) // Unauthorized
    }
    return c.json({ message }, 400)
  }
})
export default authRoute
