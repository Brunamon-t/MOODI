const express = require('express');
const cors = require('cors'); 
const pool = require('./db.js'); 

// --- IMPORTAR AS ROTAS ---
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');

const app = express();

/**
 * 🔓 CONFIGURAÇÃO DO CORS (PASSO CRÍTICO)
 * Usar cors() sem parâmetros permite que QUALQUER site (incluindo a Vercel)
 * consiga falar com esta API. É o ideal para resolver erros de rede.
 */
app.use(cors({origin: `*`})); 
app.use(express.json()); 

// Configuração da porta para o Render
const port = process.env.PORT || 8080;

// --- LIGAR AS ROTAS ---
app.use('/auth', authRoutes);       
app.use('/journal', journalRoutes); 

// --- ENDPOINTS DE TESTE ---
app.get('/api/sugestoes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Sugestao_Conteudo');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar sugestões' });
    }
});

app.get('/', (req, res) => {
  res.send('🚀 API Moodi Online e Pronta para a Vercel!');
});

app.listen(port, () => {
  console.log(`Servidor ativo na porta ${port}`);
});
