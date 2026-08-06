import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
} from "../types";
import axiosClient from "./axiosClient";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await axiosClient.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await axiosClient.post<RegisterResponse>(
    "/auth/register",
    payload,
  );
  return response.data;
}
