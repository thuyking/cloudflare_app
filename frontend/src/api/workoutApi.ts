import type {
  CreateWorkoutPayload,
  DeleteWorkoutResponse,
  UpdateWorkoutPayload,
  Workout,
  WorkoutMutationResponse,
} from "../types";
import axiosClient from "./axiosClient";

export async function getAll(): Promise<Workout[]> {
  const response = await axiosClient.get<Workout[]>("/workouts");
  return response.data;
}

export async function getById(id: number): Promise<Workout> {
  const response = await axiosClient.get<Workout>(`/workouts/${id}`);
  return response.data;
}

export async function create(
  payload: CreateWorkoutPayload,
): Promise<Workout> {
  const response = await axiosClient.post<WorkoutMutationResponse>(
    "/workouts",
    payload,
  );
  return response.data.data;
}

export async function update(
  id: number,
  payload: UpdateWorkoutPayload,
): Promise<Workout> {
  const response = await axiosClient.put<WorkoutMutationResponse>(
    `/workouts/${id}`,
    payload,
  );
  return response.data.data;
}

export async function remove(
  id: number,
): Promise<DeleteWorkoutResponse | null> {
  const response = await axiosClient.delete<DeleteWorkoutResponse>(
    `/workouts/${id}`,
  );

  if (response.status === 204) {
    return null;
  }

  return response.data;
}
