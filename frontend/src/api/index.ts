export { default as axiosClient } from "./axiosClient";
export { login, register } from "./authApi";
export {
  create as createWorkout,
  getAll as getWorkouts,
  getById as getWorkoutById,
  remove as removeWorkout,
  update as updateWorkout,
} from "./workoutApi";
export {
  create as createWorkoutPlan,
  getAll as getWorkoutPlans,
  getById as getWorkoutPlanById,
  remove as removeWorkoutPlan,
  toggleExercise as toggleWorkoutPlanExercise,
} from "./workoutPlanApi";
