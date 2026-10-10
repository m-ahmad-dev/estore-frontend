import axios from "axios";

import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../features/auth/services/tokenManager";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

const refreshToken = async () => {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/refresh-token")
      .then((response) => {
        const newAccessToken = response.data.accessToken;

        if (!newAccessToken) {
          throw new Error("Refresh response did not contain an access token.");
        }

        setAccessToken(newAccessToken);

        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (
      error.response.status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url === "/refresh-token"
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshToken();

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAccessToken();

      return Promise.reject(refreshError);
    }
  },
);

export default api;
