export interface Workout {
  id: number;
  user_id: number;
  title: string;
  exercise_type: string;
  duration: number | null;
  duration_unit: string | null;
  sets: number | null;
  reps: number | null;
  calories_burned: number;
  workout_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkoutPayload {
  title: string;
  exercise_type: string;
  duration?: number;
  duration_unit?: string;
  sets?: number;
  reps?: number;
  calories_burned: number;
  workout_date: string;
  notes?: string;
}

export type UpdateWorkoutPayload = Partial<CreateWorkoutPayload>;

export interface WorkoutMutationResponse {
  message: string;
  data: Workout;
}

export interface DeleteWorkoutResponse {
  message: string;
}
