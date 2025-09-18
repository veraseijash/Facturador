// src/services/authService.js
import api from "./api"; // usamos la instancia centralizada
import { basePath } from "../config";

export const validateUser = async (credentials) => {
  try {
    // En login usamos api.post pero desactivamos el interceptor de token
    const { data } = await api.post(`${basePath}/users/login`, credentials, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    // Aquí puedes guardar el user/token si lo devuelve el backend
    if (data?.token) {
      localStorage.setItem("user", JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error("Error al validar usuario:", error);
    throw error; // lo lanzamos para manejarlo en el componente
  }
};
