// api/chat.js

import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Inicializa o cliente, garantindo que a chave seja lida da variável de ambiente.
const ai = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY }); 
const model = 'gemini-2.5-flash';

export default async function handler(req, res) {
    // ... código CORS e Método HTTP
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido.' });
    }

    try {
        // CORRIGIDO: Leitura direta do objeto body
        const { message } = req.body; 

        if (!message) {
            return res.status(400).json({ error: 'Mensagem ausente no corpo da requisição.' });
        }

        // 2. Obtém o modelo e inicia a sessão de chat
        const modelInstance = ai.getGenerativeModel({
            model: model,
            config: {
                systemInstruction: "Você é um assistente de chatbot amigável para pequenos negócios. Mantenha as respostas concisas e úteis."
            }
        });
        
        const chat = modelInstance.startChat();

        // 3. Chama a API Gemini
        const response = await chat.sendMessage(message);

        // 4. Retorna a resposta da IA para o Frontend
        res.status(200).json({ 
            reply: response.text 
        });

    } catch (error) {
        console.error('Erro na API Gemini:', error.message);
        res.status(500).json({ 
            error: `Erro interno do servidor: ${error.message}` 
        });
    }
}