import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  (import.meta as any).env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem("auth-storage");
    console.log(
      "API Request - Raw auth storage from localStorage:",
      authStorage
    );

    if (authStorage) {
      try {
        const authData = JSON.parse(authStorage);
        console.log("API Request - Parsed auth data:", authData);

        const tokenValue = authData.state?.token || authData.token;
        if (tokenValue) {
          config.headers.Authorization = `Bearer ${tokenValue}`;
          console.log(
            "API Request - Authorization header set:",
            config.headers.Authorization
          );
        } else {
          console.log("API Request - No token found in auth data");
          console.log(
            "API Request - Available keys in authData:",
            Object.keys(authData)
          );
        }
      } catch (error) {
        console.error("Error parsing auth token:", error);
      }
    } else {
      console.log("API Request - No auth storage found in localStorage");
    }

    console.log("API Request - Final headers:", config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("auth-storage");
      // Use a more graceful redirect that doesn't cause issues
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    }

    const message = error.response?.data?.message || "An error occurred";
    toast.error(message);

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post("/auth/login", credentials),

  register: (userData: { username: string; email: string; password: string }) =>
    api.post("/auth/register", userData),

  refresh: (refreshToken: string) =>
    api.post("/auth/refresh", { refresh_token: refreshToken }),
};

// Generic resource API
export const createResourceAPI = (resourceName: string) => ({
  getAll: (params?: Record<string, any>) =>
    api.get(`/${resourceName}`, { params }),

  getById: (id: string) => api.get(`/${resourceName}/${id}`),

  create: (data: any) => api.post(`/${resourceName}`, data),

  update: (id: string, data: any) => api.put(`/${resourceName}/${id}`, data),

  delete: (id: string) => api.delete(`/${resourceName}/${id}`),
});

export default api;
