import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Flag to avoid multiple refresh calls at the same time
let isRefreshing = false;
// Queue to hold requests while refreshing
let refreshQueue = [];

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// Handle token expiration and refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Ignore auth endpoints
    const isAuthRoute =
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/register") ||
      originalRequest.url.includes("/auth/refresh");
    // Only try to refresh once per request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      // If a request is already refreshing, queue it
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        // Request new tokens
        const res = await axios.post("http://localhost:8000/auth/refresh", {
          refresh_token: refreshToken,
        });
        const newAccess = res.data.access_token;
        const newRefresh = res.data.refresh_token;

        localStorage.setItem("access_token", newAccess);
        localStorage.setItem("refresh_token", newRefresh);

        // Resolve all queued requests with the new token
        refreshQueue.forEach((p) => p.resolve(newAccess));
        refreshQueue = [];

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (err) {
        // If refresh fails, reject all queued requests and redirect to login
        refreshQueue.forEach((p) => p.reject(err));
        refreshQueue = [];

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login";
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
