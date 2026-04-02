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
  const requestInterceptor = api.interceptors.request.use(
    (config) => {
      if (auth.accessToken) {
        config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  const responseInterceptor = api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      if (originalRequest.url.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      if (!auth.accessToken) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

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

  return { requestInterceptor, responseInterceptor };
};
