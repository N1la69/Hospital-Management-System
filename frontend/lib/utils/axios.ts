import axios from "axios";

let isRefreshing = false;
let pendingRequests: ((token: string) => void)[] = [];

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// ATTACT JWT TOKEN
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// HANDLE 401 ERRORS AND TOKEN REFRESH
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        forceLogout();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await api.post("/api/auth/refresh", {
            refreshToken,
          });

          const newAccessToken = response.data.accessToken;

          localStorage.setItem("accessToken", newAccessToken);

          pendingRequests.forEach((cb) => cb(newAccessToken));
          pendingRequests = [];

          isRefreshing = false;

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          forceLogout();
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        pendingRequests.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  },
);

function forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export default api;
