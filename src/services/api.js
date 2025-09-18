// src/services/api.js
import axios from "axios";
import { basePath } from "../config";
import { toast } from "react-toastify";

// Crear instancia con baseURL
const api = axios.create({
  baseURL: basePath,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

// Interceptor de request → agrega el token siempre
api.interceptors.request.use(
  (config) => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const token = storedUser?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response → captura errores 401 globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Sesión expirada, vuelve a iniciar sesión");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
