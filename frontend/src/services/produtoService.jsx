import axios from 'axios';
// const PROXY_URL = import.meta.env.VITE_PROXY_BASE_URL + "funcionario/";
const PROXY_URL = 'http://localhost:5000/api/' + "produto/";

export const getProdutos = async () => {
    const response = await axios.get(`${PROXY_URL}all`);
    return response.data;
};

export const getProdutoById = async (id) => {
    const response = await axios.get(`${PROXY_URL}one`, { params: { id_produto: id } });
    return response.data[0];
};

export const createProduto = async (produto) => {
    const formData = new FormData();

    formData.append('nome', produto.nome);
    formData.append('descricao', produto.descricao);
    formData.append('valor_unitario', produto.valor_unitario);
    formData.append('foto', produto.foto);

    const response = await axios.post(`${PROXY_URL}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
};

export const updateProduto = async (id, produto) => {
    try {
        const formData = new FormData();
        formData.append('id_produto', id);
        formData.append('nome', produto.nome);
        formData.append('descricao', produto.descricao);
        formData.append('valor_unitario', produto.valor_unitario);
        if (produto.foto) {
            formData.append('foto', produto.foto);
        }

        const response = await axios.put(`${PROXY_URL}`, formData, {
            params: { id_produto: id },
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};
export const deleteProduto = async (id) => {
    const response = await axios.delete(`${PROXY_URL}`, { params: { id_produto: id } });
    return response.data;
};