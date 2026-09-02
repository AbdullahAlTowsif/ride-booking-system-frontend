import config from "@/config";
import axios, { type AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
});

let isRefreshing = false;
let pendingQueue: {
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  pendingQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null);
    }
  });

  pendingQueue = [];
};

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 500 &&
      error.response?.data?.message === "jwt expired" &&
      !error.config?._retry
    ) {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }
      isRefreshing = true;
      try {
        await axiosInstance.post("/auth/refresh-token");

        processQueue(null);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);
