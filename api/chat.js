// CÓDIGO CORRETO (agora usando @google/generative-ai)
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Inicializa o cliente:
const ai = new GoogleGenerativeAI({}); 
const model = 'gemini-2.5-flash';

export default async function handler(req, res) {
    // Permite que o seu frontend (o site) acesse esta API (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responde a chamadas OPTIONS (necessário para CORS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido.' });
    }

    try {
        const { message } = JSON.parse(req.body);

        if (!message) {
            return res.status(400).json({ error: 'Mensagem ausente no corpo da requisição.' });
        }

        // 2. Cria o conteúdo (prompt)
        const chat = ai.chats.create({
            model: model,
            config: {
                systemInstruction: "Você é um assistente de chatbot amigável para pequenos negócios. Mantenha as respostas concisas e úteis."
            }
        });

        // 3. Chama a API Gemini
        const response = await chat.sendMessage({ message: message });

        // 4. Retorna a resposta da IA para o Frontend
        res.status(200).json({ 
            reply: response.text 
        });

    } catch (error) {
        console.error('Erro na API Gemini:', error.message);
        res.status(500).json({ 
            error: 'Erro interno do servidor. Não foi possível conectar com a IA.' 
        });
    }
}