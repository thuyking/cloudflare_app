import type {
  CreateWorkoutPlanPayload,
  CreateWorkoutPlanResponse,
  TogglePlanExerciseResponse,
  WorkoutPlan,
} from "../types";
import axiosClient from "./axiosClient";

export async function getAll(): Promise<WorkoutPlan[]> {
  const response = await axiosClient.get<WorkoutPlan[]>("/plan");
  return response.data;
}

export async function getById(id: number): Promise<WorkoutPlan> {
  const response = await axiosClient.get<WorkoutPlan>(`/plan/${id}`);
  return response.data;
}

export async function create(
  payload: CreateWorkoutPlanPayload,
): Promise<CreateWorkoutPlanResponse> {
  const response = await axiosClient.post<CreateWorkoutPlanResponse>(
    "/plan",
    payload,
  );
  return response.data;
}

export async function toggleExercise(
  planId: number,
  exerciseId: number,
): Promise<TogglePlanExerciseResponse> {
  const response = await axiosClient.patch<TogglePlanExerciseResponse>(
    `/plan/${planId}/exercises/${exerciseId}/toggle`,
  );
  return response.data;
}

export async function remove(planId: number): Promise<boolean> {
  const response = await axiosClient.delete<boolean>(`/plan/${planId}`);
  return response.data;
}
