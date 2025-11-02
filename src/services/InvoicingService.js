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

export const compareConsumption = async (find) => {
  const { data } = await api.post(`dataPrimerNivel/comparar`, find);
  return data;
}

export const getDocumentosFacturador = async (id) => {
  const { data } = await api.get(`documentosFacturador/find/${id}`);
  return data;
}

export const getCotizacionesDocumentos = async (id) => {
  const { data } = await api.get(`cotizacionesDocumentos/find/${id}`);
  return data;
}

export const createDocumentosFacturador = async (newDocument) => {
  try {
    const { data } = await api.post(`documentosFacturador/insert`, newDocument);
    return data;
  } catch (error) {
    console.error("❌ Error subiendo documento:", error.response?.data || error);
    throw error;
  }
}

export const uploadPdf = async (pdfFile) => {
  const formData = new FormData();
  formData.append("file", pdfFile);

  const { data } = await api.post(`/documentosFacturador`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteDocumentosFacturador = async (id) => {
  const { data } = await api.delete(`documentosFacturador/${id}`);
  return data;
}

export const deleteCreateCotizaciones = async (id) => {
  const { data } = await api.delete(`cotizacionesDocumentos/${id}`);
  return data;
}