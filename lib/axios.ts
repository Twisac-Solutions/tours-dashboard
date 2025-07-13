import axios from "axios";
import { useSessionStore } from "@/lib/auth";
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const axiosPublic = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPrivate = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
const store = useSessionStore.getState();

axiosPrivate.interceptors.request.use(
  (config) => {
    const session = store.session;
    if (session?.accessToken) {
      config.headers["Authorization"] = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // store.clearSession();
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
