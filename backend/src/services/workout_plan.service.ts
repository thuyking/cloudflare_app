import { completePlanExercise, getPlanExerciseById, getWorkoutPlanDate, uncompletePlanExercise } from "../repositories/workout_plan.repository";

export async function togglePlanExerciseService(
  db: D1Database,
  userId: number,
  planId: number,
  exerciseId: number,
) {
  if (!Number.isInteger(planId) || planId <= 0) {
    throw new Error("Invalid workout plan id");
  }

  if (
    !Number.isInteger(exerciseId) ||
    exerciseId <= 0
  ) {
    throw new Error("Invalid exercise id");
  }

  const exercise = await getPlanExerciseById(
    db,
    userId,
    planId,
    exerciseId,
  );

  if (!exercise) {
    throw new Error("Workout plan exercise not found");
  }

  if (exercise.is_completed === 1) {
    await uncompletePlanExercise(
      db,
      userId,
      planId,
      exercise,
    );

    return {
      is_completed: false,
    };
  }

  const planDate = await getWorkoutPlanDate(
    db,
    userId,
    planId,
  );

  if (!planDate) {
    throw new Error("Workout plan not found");
  }

  await completePlanExercise(
    db,
    userId,
    planId,
    exercise,
    planDate,
  );

  return {
    is_completed: true,
  };
}