
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

API_FUTEBOL_TOKEN = 'SUA_CHAVE_DA_API_AQUI'  # Substitua pela sua chave real
API_FUTEBOL_URL = 'https://api.api-futebol.com.br/v1/'

@app.route('/proximo-jogo-brasil', methods=['GET'])
def proximo_jogo_brasil():
    headers = {
        "Authorization": f"Bearer {API_FUTEBOL_TOKEN}"
    }
    response = requests.get(f"{API_FUTEBOL_URL}times/3/proximos-jogos", headers=headers)
    if response.status_code != 200:
        return jsonify({"erro": "Erro ao buscar dados"}), 500

    dados = response.json()
    if not dados:
        return jsonify({"mensagem": "Nenhum jogo encontrado."})

    jogo = dados[0]
    resposta = {
        "adversario": jogo['time_visitante']['nome_popular'],
        "data": jogo['data_realizacao'],
        "hora": jogo['hora_realizacao'],
        "local": jogo['estadio']['nome'] if jogo['estadio'] else 'A definir'
    }
    return jsonify(resposta)

@app.route('/chat', methods=['POST'])
def chat_ia():
    pergunta = request.json.get('pergunta', '').lower()

    if 'próximo jogo' in pergunta or 'quando o brasil joga' in pergunta:
        prox_jogo = requests.get('http://localhost:5000/proximo-jogo-brasil').json()
        return jsonify({
            "resposta": f"O próximo jogo do Brasil é contra {prox_jogo['adversario']} em {prox_jogo['data']} às {prox_jogo['hora']} no estádio {prox_jogo['local']}."
        })

    return jsonify({"resposta": "Desculpe, ainda não tenho informações sobre isso."})

if __name__ == '__main__':
    app.run(debug=True)
