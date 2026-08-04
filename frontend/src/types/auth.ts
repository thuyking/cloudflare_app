export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  token: string;
}

export interface RegisterResponse {
  message: string;
}
