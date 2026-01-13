const express = require('express');
const router = express.Router();
const pool = require('../db');
const axios = require('axios'); // Biblioteca para falar com a Google

// ROTA: POST /journal
// DESCRIÇÃO: Cria um novo registo, analisando o texto com IA e devolvendo uma sugestão
router.post('/', async (req, res) => {
  const { fk_utilizador, emoji_selecionado, texto_livre } = req.body;

  // Validação básica
  if (!fk_utilizador) {
    return res.status(400).json({ error: 'ID do utilizador é obrigatório.' });
  }

  try {
    // Valores padrão
    let categoriaEmocional = 'Neutro';
    let intensidade = 3;

    // --- 1. INTEGRAÇÃO COM IA (GOOGLE CLOUD NLP) ---
    if (texto_livre && process.env.GOOGLE_API_KEY) {
      try {
        console.log('A contactar a Google Cloud AI...');
        
        const url = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${process.env.GOOGLE_API_KEY}`;
        
        const requestBody = {
          document: {
            type: 'PLAIN_TEXT',
            content: texto_livre,
          },
          encodingType: 'UTF8',
        };

        const response = await axios.post(url, requestBody);
        const sentiment = response.data.documentSentiment;
        
        // Log para debug
        console.log(`Google NLP -> Score: ${sentiment.score}, Magnitude: ${sentiment.magnitude}`);

        const score = sentiment.score; 
        const magnitude = sentiment.magnitude;

        // Calcular a Intensidade
        intensidade = Math.min(Math.max(Math.round(magnitude * 2) + 1, 1), 5);

        // --- LÓGICA DE SENSIBILIDADE MÁXIMA ---
        // Se for estritamente maior que 0 -> Alegria
        // Se for estritamente menor que 0 -> Tristeza
        // Só é Calma se for EXATAMENTE 0
        if (score > 0) {
            categoriaEmocional = 'Alegria';
        } else if (score < 0) {
            categoriaEmocional = 'Tristeza';
        } else {
            // Se for exatamente 0, usamos a magnitude para decidir se é stress
            if (magnitude > 0.5) {
                categoriaEmocional = 'Estresse';
            } else {
                categoriaEmocional = 'Calma';
            }
        }

        console.log(`Classificação Final: ${categoriaEmocional}`);

      } catch (aiError) {
        console.error('Erro na IA (Usando padrão):', aiError.message);
      }
    }

    // --- 2. GUARDAR NA BASE DE DADOS ---
    const newEntry = await pool.query(
      `INSERT INTO Registo_Diario 
      (fk_utilizador, emoji_selecionado, texto_livre, categoria_emocional, intensidade)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        fk_utilizador, 
        emoji_selecionado, 
        texto_livre, 
        categoriaEmocional, 
        intensidade
      ]
    );

    // --- 3. PROCURAR SUGESTÃO ADEQUADA ---
    let sugestaoEncontrada = null;
    try {
        const sugestaoQuery = await pool.query(
            `SELECT * FROM Sugestao_Conteudo 
             WHERE $1 = ANY(categoria_alvo) 
             ORDER BY RANDOM() 
             LIMIT 1`,
            [categoriaEmocional]
        );
        
        if (sugestaoQuery.rows.length > 0) {
            sugestaoEncontrada = sugestaoQuery.rows[0];
        }
    } catch (err) {
        console.log("Aviso: Não foi possível buscar sugestão.", err.message);
    }

    // --- 4. RESPOSTA FINAL ---
    res.status(201).json({
      message: 'Registo diário criado com inteligência!',
      ai_analysis: { 
          detectado: categoriaEmocional, 
          intensidade: intensidade,
          nota: "Modo de Alta Sensibilidade Ativo"
      },
      sugestao: sugestaoEncontrada,
      entry: newEntry.rows[0]
    });

  } catch (err) {
    console.error('Erro ao criar registo:', err);
    res.status(500).json({ error: 'Erro interno ao guardar o registo.' });
  }
});

// Rota GET (Mantém-se igual)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const entries = await pool.query(
      'SELECT * FROM Registo_Diario WHERE fk_utilizador = $1 ORDER BY timestamp DESC',
      [userId]
    );
    res.json(entries.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar registos.' });
  }
});

module.exports = router;