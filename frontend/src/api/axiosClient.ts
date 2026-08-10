import axios, { AxiosHeaders } from "axios";
import { tokenStorage } from "../utils";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const jwtToken = tokenStorage.getToken();

  if (jwtToken) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${jwtToken}`);
    config.headers = headers;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      tokenStorage.clearToken();

      if (window.location.pathname !== "/auth/login") {
        window.location.assign("/auth/login");
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
