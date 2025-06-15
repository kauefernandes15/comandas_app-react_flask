from flask import Blueprint, jsonify, request
from settings import API_ENDPOINT_PRODUTO
from funcoes import Funcoes
import base64
import os
bp_produto = Blueprint('produto', __name__, url_prefix="/api/produto")
# --- Rotas da API do Backend (que serão consumidas pelo React) ---
# Rota para Listar todos os Produtos (READ - All)
@bp_produto.route('/all', methods=['GET'])
def get_produtos():
# chama a função para fazer a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('get', API_ENDPOINT_PRODUTO)
# retorna o json da resposta da API externa
    return jsonify(response_data), status_code
# Rota para Obter um Produto Específico (READ - One)
@bp_produto.route('/one', methods=['GET'])
def get_produto():
# obtém o ID do Produto a partir dos parâmetros de consulta da URL
    id_produto = request.args.get('id_produto')
# valida se o id_produto foi passado na URL
    if not id_produto:
        return jsonify({"error": Funcoes.PARAMETRO_ID_PRODUTO_OBRIGATORIO}), 400
# chama a função para fazer a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_PRODUTO}{id_produto}")
# retorna o json da resposta da API externa
    return jsonify(response_data), status_code
# Rota para Deletar um Produto (DELETE)
@bp_produto.route('/', methods=['DELETE'])
def delete_produto():
# obtém o ID do Produto a partir dos parâmetros de consulta da URL
    id_produto = request.args.get('id_produto')
    print(f"ID do produto a ser deletado: {id_produto}")
# valida se o id_produto foi passado na URL
    if not id_produto:
        return jsonify({"error": Funcoes.PARAMETRO_ID_PRODUTO_OBRIGATORIO}), 400
# chama a função para fazer a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('delete', f"{API_ENDPOINT_PRODUTO}{id_produto}")
# retorna o json da resposta da API externa
    return jsonify(response_data), status_code
# Rota para Criar um novo Produto (POST)
@bp_produto.route('/', methods=['POST'])
def create_produto():
    try:
        nome = request.form.get('nome')
        descricao = request.form.get('descricao')
        valor_unitario = request.form.get('valor_unitario')
        foto = request.files.get('foto')

        if not nome or not valor_unitario:
            return jsonify({"error": "Nome e valor são obrigatórios"}), 400

        foto_base64 = None
        if foto:
            foto_data = foto.read()
            foto_base64 = base64.b64encode(foto_data).decode('utf-8')
            foto_base64 = f"data:{foto.mimetype};base64,{foto_base64}"

        data = {
            "nome": nome,
            "descricao": descricao,
            "valor_unitario": float(valor_unitario),
            "foto": foto_base64
        }

        response_data, status_code = Funcoes.make_api_request('post', API_ENDPOINT_PRODUTO, data=data)

        return jsonify(response_data), status_code

    except Exception as e:
        return jsonify({"error": f"Erro ao criar produto: {str(e)}"}), 500