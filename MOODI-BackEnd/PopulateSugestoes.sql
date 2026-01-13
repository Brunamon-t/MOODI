-- 1. Limpar dados antigos para evitar duplicados (Opcional, mas recomendado em testes)
TRUNCATE TABLE Sugestao_Conteudo CASCADE;

-- 2. Inserir Sugestões para TRISTEZA
INSERT INTO Sugestao_Conteudo (tipo_conteudo, conteudo_texto, url_externo, categoria_alvo) VALUES 
-- Frases
('Frase', 'Tudo passa. O sol volta sempre a brilhar, mesmo depois da tempestade mais escura.', NULL, ARRAY['Tristeza']::categoria_emocional[]),
('Frase', 'Não te cobres tanto. Estás a fazer o melhor que podes e isso é suficiente.', NULL, ARRAY['Tristeza']::categoria_emocional[]),
('Frase', 'Chorar é limpar a alma. Permite-te sentir para te poderes curar.', NULL, ARRAY['Tristeza']::categoria_emocional[]),
('Frase', 'Um dia de cada vez. Hoje só precisas de respirar.', NULL, ARRAY['Tristeza']::categoria_emocional[]),
('Frase', 'A tua sensibilidade é a tua força, não a tua fraqueza.', NULL, ARRAY['Tristeza']::categoria_emocional[]),
-- Vídeos
('Vídeo', 'Meditação Guiada para Curar a Tristeza', 'https://www.youtube.com/watch?v=sJ04nsiz_M0', ARRAY['Tristeza']::categoria_emocional[]),
('Vídeo', 'Música Relaxante para Acalmar o Coração', 'https://www.youtube.com/watch?v=1ZYbU82GVz4', ARRAY['Tristeza']::categoria_emocional[]),
('Vídeo', 'TED Talk: O poder da vulnerabilidade', 'https://www.youtube.com/watch?v=iCvmsMzlF7o', ARRAY['Tristeza']::categoria_emocional[]),
('Vídeo', 'Yoga Suave para Libertar Emoções', 'https://www.youtube.com/watch?v=b1H3xO3x_Js', ARRAY['Tristeza']::categoria_emocional[]),
('Vídeo', 'Paisagens Naturais para Relaxar', 'https://www.youtube.com/watch?v=BHACKCNDMW8', ARRAY['Tristeza']::categoria_emocional[]),
-- Exercícios
('Exercício', 'Escreve 3 coisas pelas quais és grato hoje, por mais pequenas que sejam.', NULL, ARRAY['Tristeza']::categoria_emocional[]),
('Exercício', 'Sai para uma caminhada de 10 minutos e apanha um pouco de sol.', NULL, ARRAY['Tristeza']::categoria_emocional[]),
('Exercício', 'Abraça alguém que amas ou o teu animal de estimação por 20 segundos.', NULL, ARRAY['Tristeza']::categoria_emocional[]),
('Exercício', 'Toma um banho quente e relaxante, focado apenas na sensação da água.', NULL, ARRAY['Tristeza']::categoria_emocional[]),
('Exercício', 'Desenha ou pinta o que estás a sentir num papel em branco.', NULL, ARRAY['Tristeza']::categoria_emocional[]);


-- 3. Inserir Sugestões para ESTRESSE / ANSIEDADE
INSERT INTO Sugestao_Conteudo (tipo_conteudo, conteudo_texto, url_externo, categoria_alvo) VALUES 
-- Frases
('Frase', 'Respira. Não precisas de resolver tudo hoje.', NULL, ARRAY['Estresse']::categoria_emocional[]),
('Frase', 'A calma é um superpoder. Desacelera.', NULL, ARRAY['Estresse']::categoria_emocional[]),
('Frase', 'Foca-te no que podes controlar e deixa ir o que não podes.', NULL, ARRAY['Estresse']::categoria_emocional[]),
('Frase', 'Este momento de tensão é temporário. Tu és mais forte que a tua ansiedade.', NULL, ARRAY['Estresse']::categoria_emocional[]),
('Frase', 'Feito é melhor que perfeito. Dá um passo de cada vez.', NULL, ARRAY['Estresse']::categoria_emocional[]),
-- Vídeos
('Vídeo', 'Técnica de Respiração 4-7-8 para Acalmar', 'https://www.youtube.com/watch?v=UXillZ6Qh2I', ARRAY['Estresse']::categoria_emocional[]),
('Vídeo', 'Meditação Mindfulness de 5 Minutos', 'https://www.youtube.com/watch?v=ssss7V1_EYeM', ARRAY['Estresse']::categoria_emocional[]),
('Vídeo', 'Sons de Chuva para Dormir e Relaxar', 'https://www.youtube.com/watch?v=mPZkdNFkNps', ARRAY['Estresse']::categoria_emocional[]),
('Vídeo', 'Alongamentos para Aliviar Tensão no Pescoço', 'https://www.youtube.com/watch?v=s-7lyvblFNI', ARRAY['Estresse']::categoria_emocional[]),
('Vídeo', 'ASMR para Relaxamento Profundo', 'https://www.youtube.com/watch?v=WJ9-xN6dGu4', ARRAY['Estresse']::categoria_emocional[]),
-- Exercícios
('Exercício', 'Técnica 5-4-3-2-1: Identifica 5 coisas que vês, 4 que tocas, 3 que ouves, 2 que cheiras, 1 que provas.', NULL, ARRAY['Estresse']::categoria_emocional[]),
('Exercício', 'Faz uma lista de tarefas e risca as que não são prioritárias para hoje.', NULL, ARRAY['Estresse']::categoria_emocional[]),
('Exercício', 'Desliga as notificações do telemóvel por 30 minutos.', NULL, ARRAY['Estresse']::categoria_emocional[]),
('Exercício', 'Bebe um chá de camomila ou cidreira calmamente.', NULL, ARRAY['Estresse']::categoria_emocional[]),
('Exercício', 'Pratica a Respiração Quadrada: Inspira 4s, Retém 4s, Expira 4s, Retém 4s.', NULL, ARRAY['Estresse']::categoria_emocional[]);


-- 4. Inserir Sugestões para RAIVA
INSERT INTO Sugestao_Conteudo (tipo_conteudo, conteudo_texto, url_externo, categoria_alvo) VALUES 
-- Frases
('Frase', 'A raiva é um sinal de que algo precisa de mudar, mas reage com inteligência.', NULL, ARRAY['Raiva']::categoria_emocional[]),
('Frase', 'Não deixes que o comportamento dos outros tire a tua paz interior.', NULL, ARRAY['Raiva']::categoria_emocional[]),
('Frase', 'Responde, não reajas. O silêncio muitas vezes é a melhor resposta.', NULL, ARRAY['Raiva']::categoria_emocional[]),
('Frase', 'Perdoar não é esquecer, é libertar-se do peso do rancor.', NULL, ARRAY['Raiva']::categoria_emocional[]),
('Frase', 'Conta até 10 antes de falar. Palavras ditas na raiva não voltam atrás.', NULL, ARRAY['Raiva']::categoria_emocional[]),
-- Vídeos
('Vídeo', 'Música Intensa para Libertar Energia (Treino)', 'https://www.youtube.com/watch?v=5qap5aO4i9A', ARRAY['Raiva']::categoria_emocional[]),
('Vídeo', 'Exercícios de Boxe em Casa para Iniciantes', 'https://www.youtube.com/watch?v=jCT_M6E3r4o', ARRAY['Raiva']::categoria_emocional[]),
('Vídeo', 'Como Controlar a Raiva - Dicas Práticas', 'https://www.youtube.com/watch?v=BsVq5R_F6RA', ARRAY['Raiva']::categoria_emocional[]),
('Vídeo', 'Meditação para Transformar a Raiva em Paz', 'https://www.youtube.com/watch?v=wkse4PPxkk4', ARRAY['Raiva']::categoria_emocional[]),
('Vídeo', 'Sons de Tempestade Forte', 'https://www.youtube.com/watch?v=nDq6TstdEi8', ARRAY['Raiva']::categoria_emocional[]),
-- Exercícios
('Exercício', 'Escreve uma carta "sem filtro" sobre o que te irritou e depois rasga-a.', NULL, ARRAY['Raiva']::categoria_emocional[]),
('Exercício', 'Faz 20 flexões ou corre no lugar para gastar a adrenalina acumulada.', NULL, ARRAY['Raiva']::categoria_emocional[]),
('Exercício', 'Grita numa almofada se precisares de libertar tensão vocal.', NULL, ARRAY['Raiva']::categoria_emocional[]),
('Exercício', 'Lava a cara com água bem fria para "reiniciar" o sistema nervoso.', NULL, ARRAY['Raiva']::categoria_emocional[]),
('Exercício', 'Afasta-te fisicamente da situação que te causou raiva por 5 minutos.', NULL, ARRAY['Raiva']::categoria_emocional[]);


-- 5. Inserir Sugestões para ALEGRIA / CALMA (Reforço Positivo)
INSERT INTO Sugestao_Conteudo (tipo_conteudo, conteudo_texto, url_externo, categoria_alvo) VALUES 
-- Frases
('Frase', 'Que bom que estás a sentir-te bem! Aproveita e espalha essa luz.', NULL, ARRAY['Alegria', 'Calma']::categoria_emocional[]),
('Frase', 'Guarda este momento na tua memória para os dias mais cinzentos.', NULL, ARRAY['Alegria', 'Calma']::categoria_emocional[]),
('Frase', 'A gratidão transforma o que temos em suficiente.', NULL, ARRAY['Alegria', 'Calma']::categoria_emocional[]),
('Frase', 'Sorri! O teu sorriso pode mudar o dia de alguém.', NULL, ARRAY['Alegria']::categoria_emocional[]),
('Frase', 'A paz vem de dentro. Continua a cultivar esse jardim.', NULL, ARRAY['Calma']::categoria_emocional[]),
-- Vídeos
('Vídeo', 'Música "Happy" para Dançar', 'https://www.youtube.com/watch?v=ZbZSe6N_BXs', ARRAY['Alegria']::categoria_emocional[]),
('Vídeo', 'Compilação de Vídeos Engraçados de Animais', 'https://www.youtube.com/watch?v=j5a0jTc9S10', ARRAY['Alegria']::categoria_emocional[]),
('Vídeo', 'TED Talk: O hábito da felicidade', 'https://www.youtube.com/watch?v=I-28eXqV14', ARRAY['Alegria']::categoria_emocional[]),
('Vídeo', 'Playlist Chill Lofi Beats', 'https://www.youtube.com/watch?v=jfKfPfyJRdk', ARRAY['Calma']::categoria_emocional[]),
('Vídeo', 'Documentário Curto sobre Natureza', 'https://www.youtube.com/watch?v=6v2L2UGZJAM', ARRAY['Calma']::categoria_emocional[]),
-- Exercícios
('Exercício', 'Partilha a tua boa disposição enviando uma mensagem simpática a um amigo.', NULL, ARRAY['Alegria']::categoria_emocional[]),
('Exercício', 'Faz uma lista de 5 conquistas recentes das quais te orgulhas.', NULL, ARRAY['Alegria']::categoria_emocional[]),
('Exercício', 'Dança a tua música favorita como se ninguém estivesse a ver.', NULL, ARRAY['Alegria']::categoria_emocional[]),
('Exercício', 'Planeia algo divertido para o próximo fim de semana.', NULL, ARRAY['Alegria']::categoria_emocional[]),
('Exercício', 'Pratica a "Meditação do Sorriso": fecha os olhos e sorri suavemente por 1 minuto.', NULL, ARRAY['Calma']::categoria_emocional[]);

-- 6. Verificar se ficou tudo guardado
SELECT tipo_conteudo, categoria_alvo, conteudo_texto FROM Sugestao_Conteudo;