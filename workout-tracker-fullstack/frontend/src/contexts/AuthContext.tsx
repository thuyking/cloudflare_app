import { useCallback, useMemo, useState, type ReactNode } from "react";
import { login as loginRequest, register as registerRequest } from "../api";
import type { LoginPayload, RegisterPayload } from "../types";
import { tokenStorage } from "../utils";
import { AuthContext } from "./authContextValue";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    Boolean(tokenStorage.getToken()),
  );

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await loginRequest(payload);
    tokenStorage.setToken(response.token);
    setIsAuthenticated(true);
    return response;
  }, []);

  const register = useCallback((payload: RegisterPayload) => {
    return registerRequest(payload);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clearToken();
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      register,
      logout,
    }),
    [isAuthenticated, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
