import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Função para enviar webhooks
export const sendWebhook = async (webhookUrl, aluno) => {
  if (!webhookUrl) {
    return;
  }

  try {
    // Gerar hash simples (mesmo padrão do backend)
    const hash = aluno.hash || generateHash();
    
    await axios.post(webhookUrl, {
      nome: aluno.nome,
      cpf: aluno.cpf,
      validation_code: hash,
      url_consulta: `${API_URL}/validar/${hash}`,
      hash: hash,
    });
    
    console.log("Webhook enviado com sucesso para:", webhookUrl);
  } catch (err) {
    console.error("Erro ao enviar Webhook:", err.message);
    // Não lançar erro para não bloquear o fluxo principal
  }
};

// Função auxiliar para gerar hash
const generateHash = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export default api;
