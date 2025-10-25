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

export const getDataSegundoNivelId = async (id) => {
  const { data } = await api.get(`dataSegundoNivel/${id}`);
  return data;
}

export const findDataPrimerNivelId = async (filter) => {
  const { data } = await api.post(`dataPrimerNivel/por-tipo-id`, filter);
  return data;
}; 

export const findActiveByCountry = async (countryId) => {
  const { data } = await api.get(`serviciosWeb/country/${countryId}`);
  return data;
}

export const getValoresEconomicos = async () => {
  const { data } = await api.get(`valoresEconomicos/list`);
  return data;
}

export const createDataTercerNivel = async (newItem) => {
  const { data } = await api.post(`dataTercerNivel`, newItem);
  return data;
}

export const deleteDataTercerNivel = async (id) => {
  const { data } = await api.delete(`dataTercerNivel/${id}`);
  return data;
}

export const actualizarTotales = async (id) => {
  const { data } = await api.patch(`dataPrimerNivel/actualizar-totales/${id}`);
  return data;
}