import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
} from "../types";
import axiosClient from "./axiosClient";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
<<<<<<< Updated upstream
  const response = await axiosClient.post<AuthResponse>("/auth/login", payload);
=======
  const response = await axiosClient.post<AuthResponse>("auth/login", payload);
>>>>>>> Stashed changes
  return response.data;
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await axiosClient.post<RegisterResponse>(
<<<<<<< Updated upstream
    "/auth/register",
=======
    "auth/register",
>>>>>>> Stashed changes
    payload,
  );
  return response.data;
}
