export interface WorkoutPlanExercise {
  id: number;
  workout_plan_id: number;
  exercise_name: string;
  sets: number | null;
  reps: number | null;
  hold_seconds: number | null;
  is_completed: number;
  workout_log_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlan {
  id: number;
  user_id: number;
  name: string;
  plan_date: string;
  created_at: string;
  updated_at: string;
  exercises: WorkoutPlanExercise[];
}

export interface CreateWorkoutPlanExercisePayload {
  exercise_name: string;
  sets?: number;
  reps?: number;
  hold_seconds?: number;
}

export interface CreateWorkoutPlanPayload {
  name: string;
  plan_date: string;
  exercises: CreateWorkoutPlanExercisePayload[];
}

export interface CreateWorkoutPlanResponse {
  message: string;
}

export interface TogglePlanExerciseResponse {
  message: string;
  data: {
    is_completed: boolean;
  };
}
