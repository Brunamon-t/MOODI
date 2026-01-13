require('dotenv').config();
const { Pool } = require('pg');

// Detetar se estamos no Render (produção) ou local
const isProduction = process.env.NODE_ENV === 'production';

// IMPORTANTE: Garantir que a DATABASE_URL do Render termina com ?sslmode=require
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  // Para o Neon, o SSL é obrigatório na nuvem
  ssl: isProduction ? { 
    rejectUnauthorized: false 
  } : false,
  // Boas práticas: timeout e limite de ligações
  connectionTimeoutMillis: 5000,
  max: 10 
});

// Teste de Ligação com Log Detalhado
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ ERRO CRÍTICO NA BASE DE DADOS:');
    console.error('Mensagem:', err.message);
    console.error('Código do Erro:', err.code);
    
    if (err.message.includes('no pg_hba.conf entry')) {
      console.error('👉 DICA: Adicionem "?sslmode=require" ao fim do DATABASE_URL no Render.');
    }
    if (err.message.includes('relation "utilizador" does not exist')) {
      console.error('👉 DICA: Têm de correr o ficheiro Tables.sql no SQL Editor do Neon!');
    }
  } else {
    console.log('✅ CONEXÃO ESTABELECIDA: O Backend está a comunicar com o Neon!');
    release();
  }
});

module.exports = pool;