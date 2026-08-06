import type { CreateWorkout, UpdateWorkout } from "../models/workout";
import { createWorkout, deleteWorkout, getWorkout, getWorkoutById, updateWorkout } from "../repositories/workout.repository";


function validateWorkoutBody(body: CreateWorkout): void {
  if (!body.title?.trim()) {
    throw new Error("Title is required");
  }

  if (!body.exercise_type?.trim()) {
    throw new Error("Exercise type is required");
  }

  if (!body.workout_date?.trim()) {
    throw new Error("Workout date is required");
  }

  if (
    typeof body.calories_burned !== "number" ||
    body.calories_burned < 0
  ) {
    throw new Error("Calories burned is invalid");
  }

  if (
    body.duration !== undefined &&
    body.duration <= 0
  ) {
    throw new Error("Duration must be greater than 0");
  }

  if (body.sets !== undefined && body.sets <= 0) {
    throw new Error("Sets must be greater than 0");
  }

  if (body.reps !== undefined && body.reps <= 0) {
    throw new Error("Reps must be greater than 0");
  }
}

export async function getWorkoutsService(
  db: D1Database,
  userId: number,
) {
  return getWorkout(db, userId);
}

export async function getWorkoutByIdService(
  db: D1Database,
  userId: number,
  workoutId: number,
) {
  if (!Number.isInteger(workoutId) || workoutId <= 0) {
    throw new Error("Invalid workout id");
  }

  const workout = await getWorkoutById(
    db,
    userId,
    workoutId,
  );

  if (!workout) {
    throw new Error("Workout not found");
  }

  return workout;
}

export async function createWorkoutService(
  db: D1Database,
  userId: number,
  body: CreateWorkout,
) {
  validateWorkoutBody(body);

  return createWorkout(db, userId, {
    ...body,
    title: body.title.trim(),
    exercise_type: body.exercise_type.trim(),
    notes: body.notes?.trim(),
  });
}

export async function updateWorkoutService(
  db: D1Database,
  userId: number,
  workoutId: number,
  body: UpdateWorkout,
) {
  if (!Number.isInteger(workoutId) || workoutId <= 0) {
    throw new Error("Invalid workout id");
  }

  const currentWorkout = await getWorkoutById(
    db,
    userId,
    workoutId,
  );

  if (!currentWorkout) {
    throw new Error("Workout not found");
  }

  const mergedWorkout: CreateWorkout = {
    title: body.title ?? currentWorkout.title,
    exercise_type:
      body.exercise_type ?? currentWorkout.exercise_type,
    duration:
      body.duration ?? currentWorkout.duration ?? undefined,
    duration_unit:
      body.duration_unit ??
      currentWorkout.duration_unit ??
      undefined,
    sets: body.sets ?? currentWorkout.sets ?? undefined,
    reps: body.reps ?? currentWorkout.reps ?? undefined,
    calories_burned:
      body.calories_burned ??
      currentWorkout.calories_burned,
    workout_date:
      body.workout_date ?? currentWorkout.workout_date,
    notes: body.notes ?? currentWorkout.notes ?? undefined,
  };

  validateWorkoutBody(mergedWorkout);

  const updatedWorkout = await updateWorkout(
    db,
    userId,
    workoutId,
    body,
  );

  if (!updatedWorkout) {
    throw new Error("Workout not found");
  }

  return updatedWorkout;
}

export async function deleteWorkoutService(
  db: D1Database,
  userId: number,
  workoutId: number,
) {
  if (!Number.isInteger(workoutId) || workoutId <= 0) {
    throw new Error("Invalid workout id");
  }

  const deleted = await deleteWorkout(
    db,
    userId,
    workoutId,
  );

  if (!deleted) {
    throw new Error("Workout not found");
  }
}
