const express = require('express');
const cors = require('cors'); // Necessário para permitir o acesso do Frontend (Vercel)
const pool = require('./db.js'); 

// --- IMPORTAR AS ROTAS MODULARES ---
// A lógica pesada foi movida para estes ficheiros para organizar o projeto
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');

const app = express();

// O Render define a porta automaticamente através de variáveis de ambiente.
// Localmente, o servidor continuará a usar a porta 8080.
const port = process.env.PORT || 8080;

// =====================================================
// MIDDLEWARES
// =====================================================

// O CORS é fundamental para que o vosso site na Vercel consiga falar com a API no Render
app.use(cors()); 

// Permite que a API entenda dados enviados em formato JSON
app.use(express.json()); 


// --- LIGAR AS ROTAS DA APLICAÇÃO ---
app.use('/auth', authRoutes);       
app.use('/journal', journalRoutes); 

// ========================================================
// WEB SERVICES (Endpoints de Consulta Direta)
// ========================================================

// Endpoint para listar utilizadores (Útil para a vossa demonstração)
app.get('/api/utilizadores', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_utilizador, pseudonimo, email FROM Utilizador');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro na BD:', err);
    res.status(500).json({ error: 'Erro ao buscar utilizadores' });
  }
});

// Endpoint para a biblioteca de sugestões
app.get('/api/sugestoes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Sugestao_Conteudo');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro na BD:', err);
        res.status(500).json({ error: 'Erro ao buscar sugestões' });
    }
});

// Rota de teste para verificar se o deploy correu bem
app.get('/', (req, res) => {
  res.send('A API Moodi está Online e a funcionar na Nuvem!');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor pronto e a correr na porta ${port}`);
});