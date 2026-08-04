const JWT_TOKEN_STORAGE_KEY = "workout_tracker_jwt_token";

export const tokenStorage = {
  getToken(): string | null {
    return localStorage.getItem(JWT_TOKEN_STORAGE_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(JWT_TOKEN_STORAGE_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(JWT_TOKEN_STORAGE_KEY);
  },
};

export { JWT_TOKEN_STORAGE_KEY };
