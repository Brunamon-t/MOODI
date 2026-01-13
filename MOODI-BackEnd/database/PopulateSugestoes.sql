-- ============================================================================
-- SCRIPT DE POVOAMENTO (DML) - PROJETO MOODI
-- ============================================================================

-- Limpar dados existentes para evitar erros de duplicado durante testes
TRUNCATE TABLE Feedback_Sugestao, Registo_Diario, Sugestao_Conteudo, Utilizador CASCADE;

-- ============================================================================
-- 1. POVOAMENTO DA BIBLIOTECA DE SUGESTÕES
-- ============================================================================

INSERT INTO Sugestao_Conteudo (tipo_conteudo, conteudo_texto, url_externo, categoria_alvo) VALUES 
('Frase', 'Tudo passa. O sol volta sempre a brilhar, mesmo depois da tempestade.', NULL, ARRAY['Tristeza']::categoria_emocional[]),
('Vídeo', 'Técnica de Respiração 4-7-8 para Ansiedade', 'https://www.youtube.com/watch?v=UXillZ6Qh2I', ARRAY['Estresse']::categoria_emocional[]),
('Exercício', 'Escreve 3 coisas pelas quais sentes gratidão hoje.', NULL, ARRAY['Tristeza', 'Neutro']::categoria_emocional[]),
('Frase', 'Respira. Não precisas de resolver tudo hoje.', NULL, ARRAY['Estresse', 'Raiva']::categoria_emocional[]),
('Frase', 'Aproveita este momento de alegria e guarda-o na memória!', NULL, ARRAY['Alegria']::categoria_emocional[]),
('Vídeo', 'Meditação Guiada para Iniciantes (5 min)', 'https://www.youtube.com/watch?v=inpok4MKVLM', ARRAY['Calma', 'Neutro']::categoria_emocional[]);

-- ============================================================================
-- 2. UTILIZADOR DE TESTE (DEMO)
-- ============================================================================

INSERT INTO Utilizador (id_externo_auth, pseudonimo, email) 
VALUES ('demo_user_123', 'AlunoDemo', 'aluno.demo@ipmaia.pt');

-- ============================================================================
-- 3. REGISTOS DE EXEMPLO (DIÁRIO)
-- ============================================================================

-- Inserir um registo de "Tristeza" para o utilizador demo
INSERT INTO Registo_Diario (fk_utilizador, emoji_selecionado, texto_livre, categoria_emocional, intensidade)
SELECT 
    id_utilizador, 
    ARRAY['😢', '☁️'], 
    'Hoje o dia foi difícil e sinto-me bastante cansada com os prazos.', 
    'Tristeza', 
    4
FROM Utilizador WHERE email = 'aluno.demo@ipmaia.pt';

-- Inserir um registo de "Alegria"
INSERT INTO Registo_Diario (fk_utilizador, emoji_selecionado, texto_livre, categoria_emocional, intensidade)
SELECT 
    id_utilizador, 
    ARRAY['😊', '🎉'], 
    'Consegui terminar o projeto de Cloud! Sinto-me realizada.', 
    'Alegria', 
    5
FROM Utilizador WHERE email = 'aluno.demo@ipmaia.pt';

-- ============================================================================
-- 4. EXEMPLOS DE FEEDBACK (O QUE FALTAVA)
-- ============================================================================

-- Feedback Positivo
INSERT INTO Feedback_Sugestao (fk_utilizador, fk_sugestao, fk_registo, util_ou_nao, comentario_opcional)
SELECT 
    u.id_utilizador, 
    s.id_sugestao, 
    r.id_registo, 
    TRUE, 
    'A frase de motivação ajudou-me a sentir melhor.'
FROM Utilizador u, Sugestao_Conteudo s, Registo_Diario r
WHERE u.email = 'aluno.demo@ipmaia.pt' 
AND r.categoria_emocional = 'Tristeza'
AND 'Tristeza' = ANY(s.categoria_alvo)
LIMIT 1;

-- ============================================================================
-- 5. VERIFICAÇÃO FINAL
-- ============================================================================
SELECT 'Sugestões' as Tabela, COUNT(*) as Total FROM Sugestao_Conteudo
UNION ALL
SELECT 'Utilizadores', COUNT(*) FROM Utilizador
UNION ALL
SELECT 'Registos Diário', COUNT(*) FROM Registo_Diario
UNION ALL
SELECT 'Feedbacks', COUNT(*) FROM Feedback_Sugestao;