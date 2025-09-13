import axios from "axios";
import { basePath } from '../config';
import { Connect } from "vite";

// Función para obtener el token y headers
const getAuthConfig = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = storedUser.token;
  if (!token) throw new Error("No se encontró token en localStorage");

  return {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
  };
};

const getAuthConfigLoad = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = storedUser.token;
  if (!token) throw new Error("No se encontró token en localStorage");

  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  };
};

// Función para listar usuarios
export const listUsers = async () => {
  try {
    const config = getAuthConfig();
    const response = await axios.get(`${basePath}/users/list`, config);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

// Función para obtener un usuario por ID
export const getUserById = async (id) => {
  try {
    const config = getAuthConfig();
    const response = await axios.get(`${basePath}/users/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    throw error;
  }  
};

// Función para actualizar user
export const updateUser = async (userId, userData) => {
  try {
    const config = getAuthConfig();
    const response = await axios.patch(
      `${basePath}/users/${userId}`,
      userData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    throw error;
  }
};

export const uploadUserImage = async (userId, imageFile) => {
  try {
    const config = getAuthConfigLoad();
    const formData = new FormData();
    formData.append("image", imageFile); // el nombre "image" debe coincidir con @UploadedFile() en NestJS

    const response = await axios.post(
      `${basePath}/users/${userId}/upload`,
      formData,
      config
    );

    return response.data;
  } catch (error) {
    console.error('Error subiendo la imagen:', error);
    throw error;
  }
};