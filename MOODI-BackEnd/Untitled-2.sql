/* ==============================================
  1. Criação dos Tipos ENUM
  ============================================== */
CREATE TYPE tipo_sugestao AS ENUM (
  'Prático', 
  'Filosófico', 
  'Espiritual'
);

CREATE TYPE categoria_emocional AS ENUM (
  'Tristeza', 
  'Calma', 
  'Raiva', 
  'Alegria', 
  'Estresse', 
  'Misto', 
  'Neutro'
);

CREATE TYPE tipo_conteudo AS ENUM (
  'Frase', 
  'Exercício', 
  'Vídeo', 
  'Artigo'
);

/* ==============================================
  2. Criação das Tabelas
  ============================================== */
CREATE TABLE Utilizador (
  id_utilizador UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
  id_externo_auth VARCHAR(255) NOT NULL UNIQUE, 
  email VARCHAR(50) NOT NULL UNIQUE, 
  pseudonimo VARCHAR(30), 
  pref_conteudo tipo_sugestao[], 
  horario_notificacao TIME[] 
);

CREATE TABLE Sugestao_Conteudo (
  id_sugestao UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_conteudo tipo_conteudo NOT NULL, 
  conteudo_texto TEXT NOT NULL, 
  url_externo VARCHAR(255), 
  categoria_alvo categoria_emocional[] NOT NULL 
);

CREATE TABLE Registo_Diario (
  id_registo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fk_utilizador UUID NOT NULL, 
  "timestamp" TIMESTAMP NOT NULL DEFAULT current_timestamp, 
  emoji_selecionado TEXT[], 
  texto_livre TEXT, 
  categoria_emocional categoria_emocional NOT NULL, 
  intensidade INT CHECK (intensidade >= 1 AND intensidade <= 5), 

  FOREIGN KEY (fk_utilizador) REFERENCES Utilizador(id_utilizador)
);

CREATE TABLE Feedback_Sugestao (
  fk_utilizador UUID NOT NULL, 
  fk_sugestao UUID NOT NULL, 
  feedback_util BOOLEAN, 
  feedback_ignorado BOOLEAN, 
  timestamp_interacao TIMESTAMP NOT NULL DEFAULT current_timestamp, 

  PRIMARY KEY (fk_utilizador, fk_sugestao), 
  FOREIGN KEY (fk_utilizador) REFERENCES Utilizador(id_utilizador),
  FOREIGN KEY (fk_sugestao) REFERENCES Sugestao_Conteudo(id_sugestao)
);