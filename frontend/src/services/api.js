import axios from "axios";

// If VITE_API_URL is set (e.g., https://my-backend.onrender.com/api), use it.
// Otherwise default to "/api" (local Vite proxy or unified deployment).
const rawBaseURL = import.meta.env.VITE_API_URL || "/api";
const baseURL = rawBaseURL.endsWith("/") ? rawBaseURL.slice(0, -1) : rawBaseURL;

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("inventory_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("inventory_token");
      localStorage.removeItem("inventory_user");
    }
    return Promise.reject(error);
  }
);

export default API;
