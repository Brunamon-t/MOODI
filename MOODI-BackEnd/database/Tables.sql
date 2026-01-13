-- ============================================================================
-- 1. TIPOS PERSONALIZADOS (ENUMS)
-- ============================================================================
-- Criamos um tipo específico para garantir que as emoções seguem um padrão
DO $$ BEGIN
    CREATE TYPE categoria_emocional AS ENUM ('Alegria', 'Tristeza', 'Estresse', 'Calma', 'Raiva', 'Neutro');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. TABELAS PRINCIPAIS
-- ============================================================================

-- Tabela de Utilizadores
CREATE TABLE IF NOT EXISTS Utilizador (
    id_utilizador UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_externo_auth VARCHAR(255) UNIQUE, 
    pseudonimo VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Sugestões de Conteúdo (A vossa Biblioteca)
CREATE TABLE IF NOT EXISTS Sugestao_Conteudo (
    id_sugestao UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_conteudo VARCHAR(50) NOT NULL, -- 'Frase', 'Vídeo', 'Exercício'
    conteudo_texto TEXT NOT NULL,
    url_externo TEXT, 
    categoria_alvo categoria_emocional[] -- Array para permitir que uma sugestão sirva para várias emoções
);

-- Tabela de Registos do Diário (Onde a IA guarda os resultados)
CREATE TABLE IF NOT EXISTS Registo_Diario (
    id_registo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fk_utilizador UUID REFERENCES Utilizador(id_utilizador) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    emoji_selecionado TEXT[], -- Array para guardar múltiplos emojis
    texto_livre TEXT NOT NULL,
    categoria_emocional categoria_emocional NOT NULL,
    intensidade INTEGER CHECK (intensidade >= 1 AND intensidade <= 5)
);

-- ============================================================================
-- 3. TABELA DE FEEDBACK
-- ============================================================================

-- Tabela de Feedback
-- Serve para avaliar se a sugestão dada pela IA foi útil para o aluno
CREATE TABLE IF NOT EXISTS Feedback_Sugestao (
    id_feedback UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fk_utilizador UUID REFERENCES Utilizador(id_utilizador) ON DELETE CASCADE,
    fk_sugestao UUID REFERENCES Sugestao_Conteudo(id_sugestao) ON DELETE CASCADE,
    fk_registo UUID REFERENCES Registo_Diario(id_registo) ON DELETE CASCADE,
    util_ou_nao BOOLEAN NOT NULL, -- TRUE para "Gostei", FALSE para "Não ajudou"
    comentario_opcional TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. ÍNDICES DE PERFORMANCE (Boas Práticas Cloud)
-- ============================================================================
-- Criamos índices para que as consultas de histórico e login sejam instantâneas
CREATE INDEX IF NOT EXISTS idx_journal_user ON Registo_Diario(fk_utilizador);
CREATE INDEX IF NOT EXISTS idx_user_email ON Utilizador(email);
CREATE INDEX IF NOT EXISTS idx_feedback_sugestao ON Feedback_Sugestao(fk_sugestao);
