// Importa o 'dotenv' para carregar as variáveis do .env
// Isto faz com que o process.env consiga ler o vosso ficheiro .env
require('dotenv').config();

// Importa a classe 'Pool' do pacote 'pg'
const { Pool } = require('pg');

// Cria o "pool" de ligações.
// Um pool é mais eficiente do que uma ligação única.
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// Exporta o pool para que o resto da vossa API (o index.js)
// o possa usar para fazer queries.
module.exports = pool;