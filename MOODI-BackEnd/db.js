require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

// Na nuvem (Render/Neon), usamos DATABASE_URL.
// Localmente, usamos as variáveis separadas (DB_USER, etc.)
const connectionString = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL 
  : `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
  connectionString: connectionString,
  // O Neon exige SSL. rejectUnauthorized: false é necessário para ambientes cloud gratuitos.
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Teste de ligação inicial
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erro crítico na ligação à BD:', err.message);
  } else {
    console.log('✅ Ligação ao Neon estabelecida com sucesso!');
  }
});

module.exports = pool;