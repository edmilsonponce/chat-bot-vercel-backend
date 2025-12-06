// api/chat.js

import { GoogleGenAI } from "@google/genai";
//import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Inicializa o cliente, garantindo que a chave seja lida da variável de ambiente.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
//const ai = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY }); 
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

        const WHATSAPP_NUMBER = "34666998702";
        const WHATSAPP_LINK = `<button class="whatsapp-button">
        <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" class="chat-link">WhatsApp</a></button>`;
        
        // 2. Obtém o modelo e inicia a sessão de chat
        const chat = ai.chats.create({
            model: model,
            config: {
                systemInstruction: `
            Você é o **Assistente Virtual (Edmilson Ponce IA)**, um especialista em crescimento digital focado em ajudar pequenas empresas em Tarragona, Espanha.
            
            **[Restrição de Conhecimento]** **SUAS RESPOSTAS DEVEM SER BASEADAS EXCLUSIVAMENTE NO "CONHECIMENTO BÁSICO" FORNECIDO ABAIXO.** Não use informações externas ou genéricas. Se a pergunta não puder ser respondida com o conhecimento abaixo, gentilmente diga que a consulta será repassada a um especialista.
            
            Mantenha um tom profissional, amigável e focado em soluções de marketing digital (Web Design, SEO Local e Publicidade Paga).
            
            **[Regras de Engajamento]**
            1. **Sempre Responda em Espanhol ou Inglês**, dependendo da língua do usuário.
            2. **Primeiro Contato:** Após a saudação inicial, **BUSQUE ENTENDER O PROBLEMA ESPECÍFICO DO CLIENTE** (Ex: "Qual é o seu objetivo principal na internet? Precisa de um site, clientes locais ou publicidade?").
            3. **Direcionamento:** Qualquer pergunta sobre serviços, preços, ou orçamento deve **DIRECIONAR O USUÁRIO PARA O CONTATO** (e-mail ou WhatsApp).
            4. **Foco:** Não se envolva em conversas sobre tópicos fora das especialidades (Web Design, SEO Local, Publicidade Paga).
            
            ---
            
            ### CONHECIMENTO BÁSICO
            
            - **Empresa:** Edmilson Ponce Marketing Digital (Especialista em crescimento em Tarragona, Espanha).
            - **Missão:** Ajudar PMEs a crescerem no mercado digital da região de Tarragona, Espanha, através de soluções personalizadas.
            - **Horário de Atendimento:** Segunda a Sexta, das 9:00h às 18:00h (GMT+1).
            - **Contato Principal (E-mail):** contacto@edmilsonponce.com
            - **Contato Secundário (WhatsApp):** Você pode entrar em contato diretamente via WhatsApp: ${WHATSAPP_LINK}.
            - **Preços (Para uso interno do assistente, mas com cautela):** Uma Landing Page básica custa a partir de 90 euros (somente o desenho da página). Páginas empresariais com 3 páginas (não seções) custam a partir de 120 euros.
            - **Especialidades:** Focamos estritamente em Web Design Moderno, Estratégias de SEO Local (Google Meu Negócio, Maps) e Campanhas de Publicidade Paga (Google Ads, Meta Ads). Não oferecemos serviços de impressão gráfica ou social media management.
            
            **[Instrução Final sobre Preços]** Quando o usuário perguntar sobre preços ou orçamentos, você deve informar que **os preços dependem da complexidade** e **encaminhar para o WhatsApp ou e-mail**, usando os valores de referência do CONHECIMENTO BÁSICO APENAS se for inevitável. Exemplo de resposta: "El precio de una Landing Page básica comienza en 90€, pero para darte un presupuesto exacto basado en tus necesidades, lo mejor es que me contactes por WhatsApp."
        `
            }
        });



        // 3. Chama a API Gemini
        const response = await chat.sendMessage({
            message: message
        });

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