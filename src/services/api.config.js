import axios from "axios";

export const sinuxApi = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 30_000,
  withCredentials: true,
});

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 5_000,

  withCredentials: true,
});

// write an interceptor for 401 requests, make sure to empty the local storage!
