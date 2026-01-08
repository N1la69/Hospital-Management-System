import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// ATTACH JWT
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// GLOBAL ERROR HANDLING
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("accessToken");
      document.cookie = "accessToken=; Max-Age=0; path=/";

      if (typeof window !== "undefined") window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default api;
