import axios from "axios";
// const PROXY_URL = import.meta.env.VITE_PROXY_BASE_URL + "funcionario/";
const PROXY_URL = 'http://localhost:5000/api/' + "funcionario/";

export const getFuncionarios = async () => {
    const response = await axios.get(`${PROXY_URL}all`);
    return response.data;
};

export const getFuncionarioById = async (id) => {
    const response = await axios.get(`${PROXY_URL}one`, {
        params: { id_funcionario: id },
    });
    return response.data[0];
};

export const createFuncionario = async (funcionario) => {
    const response = await axios.post(`${PROXY_URL}`, funcionario);
    return response.data;
};

export const updateFuncionario = async (id, funcionario) => {
    const response = await axios.put(`${PROXY_URL}`, funcionario, {
        params: { id_funcionario: id },
    });
    return response.data;
};

export const deleteFuncionario = async (id) => {
    const response = await axios.delete(`${PROXY_URL}`, {
        params: { id_funcionario: id },
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
    return false
};