import api from "./api";

export const buscarPorFechaByTipo = async (filter) => {
  const { data } = await api.post(`dataPrimerNivel/por-fecha-tipo`, filter);
  return data;
}; 