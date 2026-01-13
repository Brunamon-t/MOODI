require('dotenv').config();
const { Pool } = require('pg');

// Detetar se estamos no Render (produção) ou no vosso PC (local)
const isProduction = process.env.NODE_ENV === 'production';

// O link que copiaram do Neon
const connectionString = process.env.DATABASE_URL;

if (isProduction && !connectionString) {
  console.error('❌ ERRO: A variável DATABASE_URL não foi encontrada no Render!');
}

const pool = new Pool({
  connectionString: connectionString,
  // CONFIGURAÇÃO CRÍTICA PARA O NEON:
  // Em produção, forçamos o SSL e aceitamos certificados da cloud (rejectUnauthorized: false)
  ssl: isProduction ? { 
    rejectUnauthorized: false 
  } : false
});

// Teste de ligação com diagnóstico detalhado
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ FALHA DE LIGAÇÃO À BD:', err.stack);
    console.error('Verifiquem se o link do Neon no Render está correto e não tem espaços.');
  } else {
    console.log('✅ SUCESSO TOTAL: API ligada ao Neon PostgreSQL!');
    release();
  }
});

module.exports = pool;