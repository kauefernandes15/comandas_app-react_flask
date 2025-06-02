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

        caminho_foto = None
        if foto:
            # Caminho onde a foto será salva
            pasta_fotos = os.path.join('static', 'fotos')
            os.makedirs(pasta_fotos, exist_ok=True)
            caminho_foto = os.path.join(pasta_fotos, foto.filename)
            foto.save(caminho_foto)

        # Aqui você pode salvar no banco, se quiser
        return jsonify({
            "mensagem": "Produto criado com sucesso",
            "produto": {
                "nome": nome,
                "descricao": descricao,
                "valor_unitario": float(valor_unitario),
                "foto": caminho_foto
            }
        }), 201

    except Exception as e:
        return jsonify({"error": f"Erro ao criar produto: {str(e)}"}), 500
# Rota para Atualizar um Produto existente (PUT)
@bp_produto.route('/', methods=['PUT'])
def update_produto():
# obtém a foto enviada no formulário
# o arquivo deve ter sido enviado como multipart/form-data
    foto = request.files.get('foto')
# nos casos onde o usuário não alterar a foto
# o conteudo da foto já pode ter vindo como base64
# então nesses casos não é necessário converter novamente
    if foto:
# nova foto foi enviada
# Converte a foto para Base64
# realiza a leitura do conteúdo do arquivo com a foto
        foto_data = foto.read()
# converte para Base64
        foto_base64 = base64.b64encode(foto_data).decode('utf-8')
# adiciona o prefixo para indicar o tipo de arquivo
        foto_base64 = f"data:{foto.mimetype};base64,{foto_base64}"
    else:
# foto não foi enviada, então vamos usar a foto já existente
# os dados já foram enviados como base64
# realizar a leitura normal do conteúdo
        foto_base64 = request.form.get('foto')
# Monta o JSON para enviar à API externa
    data = {
        "id_produto": request.form.get('id_produto'),
        "nome": request.form.get('nome'),
        "descricao": request.form.get('descricao'),
        "valor_unitario": request.form.get('valor_unitario'),
        "foto": foto_base64
}
# chama a função para fazer a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('put', f"{API_ENDPOINT_PRODUTO}{data.get('id_produto')}", data=data)
# retorna o json da resposta da API externa
    return jsonify(response_data), status_code