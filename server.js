import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// DEBUG (importante)
console.log("API KEY:", process.env.OPENAI_API_KEY ? "OK" : "MISSING");

const app = express();
app.use(cors());
app.use(express.json());

// Inicialização segura do OpenAI
let openai;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} else {
  console.log("⚠️ OPENAI_API_KEY não encontrada");
}

// Rota principal de chat
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Validação básica
    if (!message) {
      return res.status(400).json({
        error: "Mensagem não enviada"
      });
    }

    // Segurança: garante que OpenAI existe
    if (!openai) {
      return res.status(500).json({
        error: "OpenAI não configurado"
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um professor de inglês focado em conversação."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error("ERRO:", error);

    res.status(500).json({
      error: "Erro no servidor"
    });
  }
});

// Rota de teste (MUITO IMPORTANTE)
app.get("/", (req, res) => {
  res.send("Career English Pro API is running 🚀");
});

// Porta dinâmica do Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
