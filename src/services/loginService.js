import axios from "axios";
import { basePath } from '../config';

const config = {
  headers: {
      'Content-Type': 'application/json;charset=UTF-8',
  },
}

export const validateUser = async (credentials) => {
  try {
    const response = await axios.post(`${basePath}/users/login`, credentials, config);
    return response.data; 
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error; // lo lanzamos para manejarlo en el componente
  }
};