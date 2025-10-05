import api from "./api";

export const buscarPorFechaByTipo = async (filter) => {
  const { data } = await api.post(`dataPrimerNivel/por-fecha-tipo`, filter);
  return data;
}; 

export const updateStatusPrefactura = async (id, statusData) => {
  const { data } = await api.patch(`statusPrefactura/${id}`, statusData);
  return data;
}; 

export const getDataPrimerNivelId = async (id) => {
  const { data } = await api.get(`dataPrimerNivel/${id}`);
  return data;
}

export const findDataPrimerNivelId = async (filter) => {
  console.log('paso')
  const { data } = await api.post(`dataPrimerNivel/por-tipo-id`, filter);
  return data;
}; 