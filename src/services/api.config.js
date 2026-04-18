import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { useAuthStore } from "../authentication/authStore";
import { toast } from "react-hot-toast";

export const sinuxApi = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 600_000,
  withCredentials: true,
});

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 600_000,
  withCredentials: true,
});


// --- Token Refresh Logic ---

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

const setupInterceptor = (apiInstance) => {
  apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is not 401, or we've already retried this request once
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      // If we are already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      // If it's a 401 and not already retried
      originalRequest._retry = true;
      isRefreshing = true;

      // Import RefreshTokenAsync here to avoid circular dependencies if any
      const { RefreshTokenAsync } = await import("./authService");

      return new Promise((resolve, reject) => {
        RefreshTokenAsync()
          .then(() => {
            processQueue(null);
            resolve(apiInstance(originalRequest));
          })
          .catch((err) => {
            processQueue(err);
            // Clear auth and redirect on final failure
            useAuthStore.getState().clearAuth();
            toast.error("Your session has expired. Please sign in again.", {
              duration: 5000,
              id: "session-expired", // deduplicate if fired multiple times
            });
            if (window.location.pathname !== "/auth") {
              window.location.href = "/auth";
            }
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    },
  );
};

// Only apply the 401-refresh interceptor to the main API.
// Do NOT apply it to authApi — the refresh-token call itself lives on authApi,
// so intercepting its 401 would create a circular retry loop.
// --- Supabase Client ---
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

setupInterceptor(sinuxApi);
