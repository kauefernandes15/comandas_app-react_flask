import axios from "axios";
// const PROXY_URL = import.meta.env.VITE_PROXY_BASE_URL + "cliente/";
const PROXY_URL = 'http://localhost:5000/api/' + "cliente/";

export const getClientes = async () => {
  const response = await axios.get(`${PROXY_URL}all`);
  return response.data;
};

export const getClienteById = async (id) => {
  const response = await axios.get(`${PROXY_URL}one`, {
    params: { id_cliente: id },
  });
  return response.data[0];
};

export const createCliente = async (cliente) => {
  const response = await axios.post(`${PROXY_URL}`, cliente);
  return response.data;
};

export const updateCliente = async (id, cliente) => {
  const response = await axios.put(`${PROXY_URL}`, cliente, {
    params: { id_cliente: id },
  });
  return response.data;
};

export const deleteCliente = async (id) => {
  const response = await axios.delete(`${PROXY_URL}`, {
    params: { id_cliente: id },
  });
  return response.data;
};

export const checkCpfExists = async (cpf) => {
  const response = await axios.get(`${PROXY_URL}cpf`, {
    params: { cpf },
  });
  if (Array.isArray(response.data) && response.data.length > 0) {
    return true;
  }
  return false;
};