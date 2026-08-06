import type { CreateWorkout, UpdateWorkout, Workout } from "../models/workout";

export async function getWorkout(db: D1Database, useId: number): Promise<Workout[]> {
  const result = await db.prepare(`
      SELECT * FROM workout WHERE user_id = ? ORDER BY workout_date DESC, created_at DESC
    `).bind(useId).all<Workout>();
  return result.results
}

export async function getWorkoutById(db: D1Database, useId: number, workoutId: number) {
  const result = await db.prepare(`
      SELECT * FROM workout WHERE user_id = ? AND id = ?
    `).bind(useId, workoutId).first<Workout>()
  return result
}

export async function createWorkout(db: D1Database, userId: number, body: CreateWorkout) {
  const result = await db.prepare(`
    INSERT INTO workout(	
        user_id,
				title,
				exercise_type,
				duration,
				duration_unit,
				sets,
				reps,
				calories_burned,
				workout_date,
				notes
    )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `).bind(
    userId,
    body.title,
    body.exercise_type,
    body.duration ?? null,
    body.duration_unit ?? null,
    body.sets ?? null,
    body.reps ?? null,
    body.calories_burned,
    body.workout_date,
    body.notes ?? null,
  ).first<Workout>()
  if (!result) {
    throw new Error("Cannot create workout");
  }
  return result
}

export async function updateWorkout(db: D1Database, userId: number, workoutId: number, body: UpdateWorkout) {
  const currentWorkout = await getWorkoutById(db, userId, workoutId)
  if (!currentWorkout) {
    return null;
  }
  const result = await db.prepare(`
        UPDATE workout
        SET
        title = ?,
				exercise_type = ?,
				duration = ?,
				duration_unit = ?,
				sets = ?,
				reps = ?,
				calories_burned = ?,
				workout_date = ?,
				notes = ?,
				updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
        AND id = ?
        RETURNING *
    `).bind(
    body.title ?? currentWorkout.title,
    body.exercise_type ?? currentWorkout.exercise_type,
    body.duration ?? currentWorkout.duration,
    body.duration_unit ?? currentWorkout.duration_unit,
    body.sets ?? currentWorkout.sets,
    body.reps ?? currentWorkout.reps,
    body.calories_burned ?? currentWorkout.calories_burned,
    body.workout_date ?? currentWorkout.workout_date,
    body.notes ?? currentWorkout.notes,
    userId,
    workoutId
  ).first<Workout>()
  return result
}

export async function deleteWorkout(db: D1Database, userId: number, workoutId: number): Promise<boolean> {
  const result = await db.prepare(`
      DELETE FROM workout WHERE user_id = ? AND id = ?;
    `).bind(userId, workoutId).run();
  return result.meta.changes > 0; // result.meta.changes là số phần tử đã xóa changes trả về số 0 là 0 xóa gì 1 là xóa 1.
}
