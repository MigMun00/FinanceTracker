import api from "./api";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupInterceptors = (auth) => {
  // Attach access token to every request
  api.interceptors.request.use(
    (config) => {
      if (auth.accessToken) {
        config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Handle 401 errors and refresh token
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 1. Only handle 401
      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      // 2. Skip special endpoints
      if (
        originalRequest.url.includes("/auth/refresh") ||
        originalRequest.url.includes("/users/me")
      ) {
        return Promise.reject(error);
      }

      // 3. Don't attempt refresh if not ready
      if (!auth.accessToken || !auth.initialized) {
        return Promise.reject(error);
      }

      // 4. Prevent infinite retry
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      // 5. Handle concurrent requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await auth.refresh();

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await auth.logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    },
  );
};
