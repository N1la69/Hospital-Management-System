import axios from "axios";

let isRefreshing = false;
let pendingRequests: ((token: string) => void)[] = [];

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// ATTACH JWT TOKEN
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("➡️ Sending request to:", config.url);
  } else {
    console.log("➡️ Sending request to:", config.url, "(no token)");
  }

  return config;
});

// HANDLE 401 ERRORS AND TOKEN REFRESH
api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log("❌ API Error on:", originalRequest?.url);
    console.log("Status:", error.response?.status);

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("⚠️ 401 detected – access token expired or invalid");

      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.log("⛔ No refresh token found. Logging out.");
        forceLogout();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          console.log("🔄 Sending refresh token request...");

          const response = await api.post("/api/auth/refresh", {
            refreshToken,
          });

          const newAccessToken = response.data.accessToken;

          console.log(
            "✅ Refresh successful. New access token:",
            newAccessToken.substring(0, 20) + "...",
          );

          localStorage.setItem("accessToken", newAccessToken);

          pendingRequests.forEach((cb) => cb(newAccessToken));
          pendingRequests = [];

          isRefreshing = false;

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.log("⛔ Refresh failed. Logging out.");
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
