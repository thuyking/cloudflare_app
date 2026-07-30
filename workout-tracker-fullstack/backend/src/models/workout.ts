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

export interface CreateWorkout {
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

export type UpdateWorkout = Partial<CreateWorkout>


export interface WorkoutPlan {
	id: number;
	user_id: number;
	name: string;
	plan_date: string;
	created_at: string;
	updated_at: string;
	exercises: WorkoutPlanExercise[];
}

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

export interface CreateWorkoutPlanExerciseBody {
	exercise_name: string;
	sets?: number;
	reps?: number;
	hold_seconds?: number;
}

export interface CreateWorkoutPlanBody {
	name: string;
	plan_date: string;
	exercises: CreateWorkoutPlanExerciseBody[];
}

export type UpdateWorkoutPlanBody = Partial<CreateWorkoutPlanBody>;