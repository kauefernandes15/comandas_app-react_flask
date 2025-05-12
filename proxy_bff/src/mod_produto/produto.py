from flask import Blueprint, jsonify, request
from settings import API_ENDPOINT_PRODUTO
from funcoes import Funcoes

bp_produto = Blueprint('produto', __name__, url_prefix="/api/produto")


@bp_produto.route('/all', methods=['GET'])
def get_produtos():
    response_data, status_code = Funcoes.make_api_request('get', API_ENDPOINT_PRODUTO)
    return jsonify(response_data), status_code


@bp_produto.route('/one', methods=['GET'])
def get_produto():
    id_produto = request.args.get('id_produto')
    if not id_produto:
        return jsonify({"error": "O parâmetro 'id_produto' é obrigatório"}), 400
    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_PRODUTO}{id_produto}")
    return jsonify(response_data), status_code


@bp_produto.route('/', methods=['POST'])
def create_produto():
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400
    data = request.get_json()
    required_fields = ['nome', 'descricao', 'foto', 'valor_unitario']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400
    response_data, status_code = Funcoes.make_api_request('post', API_ENDPOINT_PRODUTO, data=data)
    return jsonify(response_data), status_code


@bp_produto.route('/', methods=['PUT'])
def update_produto():
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400
    data = request.get_json()
    required_fields = ['id_produto', 'nome', 'descricao', 'foto', 'valor_unitario']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400
    response_data, status_code = Funcoes.make_api_request('put', f"{API_ENDPOINT_PRODUTO}{data.get('id_produto')}", data=data)
    return jsonify(response_data), status_code


@bp_produto.route('/', methods=['DELETE'])
def delete_produto():
    id_produto = request.args.get('id_produto')
    if not id_produto:
        return jsonify({"error": "O parâmetro 'id_produto' é obrigatório"}), 400
    response_data, status_code = Funcoes.make_api_request('delete', f"{API_ENDPOINT_PRODUTO}{id_produto}")
    return jsonify(response_data), status_code