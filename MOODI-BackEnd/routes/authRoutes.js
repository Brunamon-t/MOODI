const express = require('express');
const router = express.Router();
const pool = require('../db'); // Importa o nosso pool de ligação (repare no ../)

/*
 * ESTE É O ENDPOINT "CALLBACK" (CU1 + CU2)
 * POST /auth/callback
 *
 * Simula o que o Google/IdP nos envia.
 * Recebe: { id_externo_auth, email, pseudonimo }
 * Devolve: Os dados do utilizador (seja novo ou antigo)
 */
router.post('/callback', async (req, res) => {
  const { id_externo_auth, email, pseudonimo } = req.body;

  // 1. Validar se recebemos os dados mínimos
  if (!id_externo_auth || !email) {
    return res.status(400).json({ error: 'ID Externo e Email são obrigatórios.' });
  }

  try {
    // 2. Tentar encontrar o utilizador (CU2 - Autenticar)
    let user = await pool.query(
      'SELECT * FROM Utilizador WHERE id_externo_auth = $1',
      [id_externo_auth]
    );

    if (user.rows.length > 0) {
      // --- UTILIZADOR ENCONTRADO (CU2) ---
      console.log('Utilizador encontrado (CU2):', user.rows[0].email);
      // NOTA: Aqui, no futuro, iríamos gerar um token JWT
      res.status(200).json({
        message: 'Utilizador autenticado com sucesso (CU2)',
        user: user.rows[0],
      });
    } else {
      // --- UTILIZADOR NÃO ENCONTRADO, VAMOS CRIAR (CU1) ---
      console.log('Utilizador não encontrado. A criar (CU1)...');

      // O SRS  não define pref_conteudo ou horario_notificacao como obrigatórios
      const newUser = await pool.query(
        `INSERT INTO Utilizador (id_externo_auth, email, pseudonimo)
         VALUES ($1, $2, $3)
         RETURNING *`, // RETURNING * devolve o utilizador que acabou de ser criado
        [id_externo_auth, email, pseudonimo || null] // Usa o pseudónimo se existir, senão null
      );

      console.log('Novo utilizador registado (CU1):', newUser.rows[0].email);
      // NOTA: Aqui também iríamos gerar um token JWT
      res.status(201).json({ // 201 = Created
        message: 'Novo utilizador registado com sucesso (CU1)',
        user: newUser.rows[0],
      });
    }
  } catch (err) {
    // Erro comum: email duplicado se tentar registar com um email
    // que já existe mas com um id_externo diferente.
    if (err.code === '23505') { // Erro de violação de constraint (UNIQUE)
      return res.status(409).json({ error: 'Este email já está a ser usado.' });
    }
    console.error('Erro no /auth/callback:', err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;