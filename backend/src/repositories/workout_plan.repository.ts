import type { CreateWorkoutPlanBody, WorkoutPlan, WorkoutPlanExercise } from "../models/workout";
interface WorkoutPlanJoinRow {
  plan_id: number;
  user_id: number;
  plan_name: string;
  plan_date: string;
  plan_created_at: string;
  plan_updated_at: string;

  exercise_id: number | null;
  exercise_name: string | null;
  sets: number | null;
  reps: number | null;
  hold_seconds: number | null;
  is_completed: number | null;
  workout_log_id: number | null;
  exercise_created_at: string | null;
  exercise_updated_at: string | null;
}
interface CreatedPlanRow {
  id: number;
}

export async function getWorkoutPlan(db: D1Database, userId: number): Promise<WorkoutPlan[]> {
  const result = await db.prepare(`
        SELECT 
          wp.id AS plan_id,
          wp.user_id,
          wp.name AS plan_name,
          wp.plan_date,
          wp.created_at AS plan_created_at,
          wp.updated_at AS plan_updated_at,

          wpe.id AS exercise_id,
          wpe.exercise_name,
          wpe.sets,
          wpe.reps,
          wpe.hold_seconds,
          wpe.is_completed,
          wpe.workout_log_id,
          wpe.created_at AS exercise_created_at,
				  wpe.updated_at AS exercise_updated_at
        FROM workout_plans wp
        LEFT JOIN workout_plan_exercises wpe ON wpe.workout_plan_id = wp.id
        WHERE wp.user_id = ?
        ORDER BY 
          wp.plan_date ASC,
          wp.id ASC,
          wpe.id ASC
    `).bind(userId).all<WorkoutPlanJoinRow>()
  const planMap = new Map<number, WorkoutPlan>()
  for (const row of result.results) {
    let plan = planMap.get(row.plan_id)
    if (!plan) {
      plan = {
        id: row.plan_id,
        user_id: row.user_id,
        name: row.plan_name,
        plan_date: row.plan_date,
        created_at: row.plan_created_at,
        updated_at: row.plan_updated_at,
        exercises: [],
      }
      planMap.set(row.plan_id, plan)
    }

    if (row.exercise_id !== null && row.exercise_name !== null) {
      plan.exercises.push({
        id: row.exercise_id,
        workout_plan_id: row.plan_id,
        exercise_name: row.exercise_name,
        sets: row.sets,
        reps: row.reps,
        hold_seconds: row.hold_seconds,
        is_completed: row.is_completed ?? 0,
        workout_log_id: row.workout_log_id,
        created_at: row.exercise_created_at ?? "",
        updated_at: row.exercise_updated_at ?? "",
      })
    }
  }
  return Array.from(planMap.values())
}

export async function createWorkoutPlan(db: D1Database, userId: number, body: CreateWorkoutPlanBody) {
  const createPlan = await db.prepare(`
      INSERT INTO workout_plans (
        user_id,
        name,
        plan_date
      )
      VALUES(?, ?, ?)
      RETURNING id
    `).bind(userId, body.name, body.plan_date).first<CreatedPlanRow>();

  if (!createPlan) {
    throw new Error("Cannot create workout plan");
  }

  const statement = body.exercises.map((exercise) => {
    return db.prepare(`
        INSERT INTO workout_plan_exercises (
          workout_plan_id,
					exercise_name,
					sets,
					reps,
					hold_seconds
        )
        VALUES(?, ?, ?, ?, ?)
      `).bind(
      createPlan.id,
      exercise.exercise_name,
      exercise.sets ?? null,
      exercise.reps ?? null,
      exercise.hold_seconds ?? null
    )
  })
  if (statement.length > 0) {
    await db.batch(statement)
  }
  return createPlan.id
}


export async function getWorkoutPlanById(db: D1Database, userId: number, planId: number): Promise<WorkoutPlan | null> {
  const result = await db.prepare(`
        SELECT 
          wp.id AS plan_id,
          wp.user_id,
          wp.name AS plan_name,
          wp.plan_date,
          wp.created_at AS plan_created_at,
          wp.updated_at AS plan_updated_at,

          wpe.id AS exercise_id,
          wpe.exercise_name,
          wpe.sets,
          wpe.reps,
          wpe.hold_seconds,
          wpe.is_completed,
          wpe.workout_log_id,
          wpe.created_at AS exercise_created_at,
				  wpe.updated_at AS exercise_updated_at
        FROM workout_plans wp
        LEFT JOIN workout_plan_exercises wpe ON wpe.workout_plan_id = wp.id
     		WHERE wp.id = ?
			  AND wp.user_id = ?

			  ORDER BY wpe.id ASC

    `).bind(planId, userId).all<WorkoutPlanJoinRow>()
  const firstRow = result.results[0]
  const plan: WorkoutPlan = {
    id: firstRow.plan_id,
    user_id: firstRow.user_id,
    name: firstRow.plan_name,
    plan_date: firstRow.plan_date,
    created_at: firstRow.plan_created_at,
    updated_at: firstRow.plan_updated_at,
    exercises: [],
  }
  for (const row of result.results) {
    if (row.exercise_id !== null && row.exercise_name !== null) {
      plan.exercises.push({
        id: row.exercise_id,
        workout_plan_id: row.plan_id,
        exercise_name: row.exercise_name,
        sets: row.sets,
        reps: row.reps,
        hold_seconds: row.hold_seconds,
        is_completed: row.is_completed ?? 0,
        workout_log_id: row.workout_log_id,
        created_at: row.exercise_created_at ?? "",
        updated_at: row.exercise_updated_at ?? "",
      })
    }
  }
  return plan;
}

export async function getPlanExerciseById(db: D1Database, userId: number, planId: number, exerciseId: number) {
  const result = await db.prepare(`
      SELECT wpe. * 
      FROM workout_plan_exercises wpe

      INNER JOIN workout_plans wp ON wp.id = wpe.workout_plan_id
      WHERE wpe.id = ?
      AND wpe.workout_plan_id = ?
      AND user_id = ? 
    `).bind(exerciseId, planId, userId).first<WorkoutPlanExercise>()
  return result ?? null
}

export async function completePlanExercise(db: D1Database, userId: number, planId: number, exercise: WorkoutPlanExercise, planDate: string) {
  const workout = await db.prepare(`
      INSERT INTO workout (
        user_id,
				title,
				exercise_type,
				sets,
				reps,
				duration,
				duration_unit,
				calories_burned,
				workout_date,
				notes
      )
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `).bind(
    userId,
    exercise.exercise_name,
    exercise.exercise_name,
    exercise.sets,
    exercise.reps,
    exercise.hold_seconds,
    exercise.hold_seconds !== null ? "second" : null,
    0,
    planDate,
    `Created from workout plan ${planId}`,
  ).first<CreatedPlanRow>()
  if (!workout) {
    throw new Error("Cannot create workout log");
  }

  await db.prepare(`
      UPDATE workout_plan_exercises
      SET 
        is_completed = 1,
        workout_log_id = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      AND workout_plan_id = ?
    `).bind(workout.id, exercise.id, planId).run();
}

export async function uncompletePlanExercise(db: D1Database, userId: number, planId: number, exercise: WorkoutPlanExercise) {
  await db.prepare(`
      UPDATE workout_plan_exercises
      SET
        is_completed = 0,
        workout_log_id = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      AND workout_plan_id = ?
    `).bind(exercise.id, planId).run()

  if (exercise.workout_log_id !== null) {
    await db.prepare(`
        DELETE FROM workout WHERE id = ? AND user_id = ?
      `).bind(exercise.workout_log_id, userId).run()
  }
}

export async function getWorkoutPlanDate(db: D1Database, userId: number, planId: number) {
  const result = await db.prepare(`
      SELECT plan_date FROM workout_plans WHERE id = ? AND user_id = ?
    `).bind(planId, userId).first<{ plan_date: string }>()
  return result?.plan_date ?? null
}


export async function deleteWorkoutPlan(db: D1Database, userId: number, planId: number) {
  const existingPlan = await db.prepare(`
      SELECT id FROM workout_plans WHERE id = ? AND user_id = ?
    `).bind(planId, userId).first<{ id: number }>()
  if (!existingPlan) {
    return false;
  }
  await db.prepare(`
      DELETE FROM workout_plan_exercises WHERE workout_plan_id = ?
    `).bind(planId).run();
  await db.prepare(`
      DELETE FROM workout_plans WHERE id = ? AND user_id = ?
    `).bind(planId, userId).run()
  await db.prepare(`
      delete from workout where id = ? and 
    `)
  return true;
}
