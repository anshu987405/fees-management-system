import axios from "axios";

function resolveApiUrl() {
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== "auto") {
    return import.meta.env.VITE_API_URL;
  }

  if (window.location.port === "5173") {
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }

  if (window.location.port === "4173") {
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }

  if (window.location.origin) {
    return `${window.location.origin}/api`;
  }

  return `${window.location.protocol}//${window.location.hostname}:5000/api`;
}

export const api = axios.create({
  baseURL: resolveApiUrl(),
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("feespro_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("feespro_token");
    }
    return Promise.reject(error);
  }
);
