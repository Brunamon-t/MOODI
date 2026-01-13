import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Smile, Heart, Send, History, LogOut, Sparkles, 
  ChevronRight, AlertCircle, RefreshCw, BookOpen, Video,
  Calendar, MessageSquare, WifiOff
} from 'lucide-react';

/**
 * 🔗 LIGAÇÃO À API
 * Substituam pelo URL exato que aparece no vosso Dashboard do Render.
 * Exemplo: 'https://moodi-backend-abc.onrender.com'
 */
const API_URL = 'https://moodi-api.onrender.com'; 

export default function App() {
  // --- ESTADOS ---
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); 
  const [email, setEmail] = useState('aluno@ipmaia.pt');
  const [error, setError] = useState(null);
  const [isServerOffline, setIsServerOffline] = useState(false);
  
  const [text, setText] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  
  const [suggestions, setSuggestions] = useState([]);
  const [userHistory, setUserHistory] = useState([]);

  // --- CARREGAMENTO DE DADOS ---
  
  // 1. Carregar Biblioteca de Sugestões e verificar estado do servidor
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/sugestoes`, { timeout: 5000 });
        setSuggestions(res.data);
        setIsServerOffline(false);
      } catch (err) {
        console.error("Erro ao carregar biblioteca:", err);
        setIsServerOffline(true);
        setError("O servidor parece estar offline ou ainda está a arrancar no Render.");
      }
    };
    checkConnection();
  }, []);

  // 2. Carregar Histórico do Utilizador
  useEffect(() => {
    if (user) {
      axios.get(`${API_URL}/journal/${user.id_utilizador}`)
        .then(res => setUserHistory(res.data))
        .catch(err => {
          console.error("Erro ao carregar histórico:", err);
          setError("Não foi possível carregar o teu histórico.");
        });
    }
  }, [user]);

  // --- FUNÇÕES DE AÇÃO ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/callback`, {
        email,
        pseudonimo: email.split('@')[0]
      });
      setUser(res.data.user);
      setPage('dashboard');
      setIsServerOffline(false);
    } catch (err) {
      setIsServerOffline(true);
      setError("Sem resposta do servidor. Verifica se o backend no Render está 'Live' e se o URL está correto.");
    }
  };

  const handleSendEntry = async () => {
    if (!text || selectedEmojis.length === 0) {
      alert("Por favor, seleciona um emoji e escreve um pequeno texto.");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/journal`, {
        fk_utilizador: user.id_utilizador,
        emoji_selecionado: selectedEmojis,
        texto_livre: text
      });
      
      setLastResult(res.data);
      setText('');
      setSelectedEmojis([]);
      
      const hRes = await axios.get(`${API_URL}/journal/${user.id_utilizador}`);
      setUserHistory(hRes.data);
    } catch (err) {
      setError("Erro na análise. O servidor pode estar ocupado ou desligado.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- COMPONENTES DE INTERFACE ---

  // Banner de Erro Crítico
  const ConnectionAlert = () => (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-2xl flex items-center gap-3 animate-pulse">
      <WifiOff className="text-amber-600" />
      <div>
        <p className="text-amber-800 font-bold text-sm">Problema de Ligação</p>
        <p className="text-amber-700 text-xs">A API não responde. O Render pode estar a "acordar" o servidor gratuito.</p>
      </div>
    </div>
  );

  if (page === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl text-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <Smile size={48} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-2">Moodi</h1>
          <p className="text-slate-400 mb-8 font-medium">O teu bem-estar começa aqui.</p>

          {isServerOffline && <ConnectionAlert />}
          {error && !isServerOffline && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm flex gap-2 items-center">
              <AlertCircle size={16}/> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none"
              placeholder="teu.email@ipmaia.pt"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              disabled={isServerOffline && !error}
              className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 disabled:bg-slate-300"
            >
              Entrar no Diário
            </button>
          </form>
          
          <p className="mt-6 text-[10px] text-slate-400 uppercase tracking-widest">
            API: {API_URL}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-2xl tracking-tighter">
            <Sparkles fill="currentColor" /> MOODI
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Utilizador</p>
              <p className="font-bold text-slate-700">{user?.pseudonimo}</p>
            </div>
            <button onClick={() => setPage('login')} className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {isServerOffline && <ConnectionAlert />}
        
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* COLUNA ESQUERDA: NOVO REGISTO */}
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-indigo-50 opacity-10"><MessageSquare size={120} /></div>
              
              <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <Heart className="text-pink-500" fill="currentColor" /> Como estás hoje?
              </h2>

              <div className="space-y-8">
                {/* Seletor de Emojis */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {['😊', '🥳', '😴', '🤔', '😢', '😡', '😨', '😐'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedEmojis([emoji])}
                      className={`text-4xl w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
                        selectedEmojis.includes(emoji) 
                        ? 'bg-indigo-600 text-white scale-110 shadow-xl shadow-indigo-200' 
                        : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <textarea 
                  className="w-full h-48 p-8 bg-slate-50 rounded-[2rem] border-none text-xl outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all placeholder:text-slate-300"
                  placeholder="Desabafa aqui o que sentes..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                <div className="flex justify-end">
                  <button 
                    onClick={handleSendEntry}
                    disabled={isAnalyzing || isServerOffline}
                    className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-indigo-700 transition-all disabled:bg-slate-200"
                  >
                    {isAnalyzing ? <RefreshCw className="animate-spin" /> : <><Send size={20} /> Analisar Dia</>}
                  </button>
                </div>
              </div>
            </section>

            {/* FEEDBACK DA IA */}
            {lastResult && (
              <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-10 text-white shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col md:flex-row gap-10 items-center">
                  <div className="flex-1">
                    <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-2">Análise Moodi AI</p>
                    <h3 className="text-4xl font-black mb-4">Parece que sentes <span className="underline decoration-indigo-300">{lastResult.ai_analysis?.detectado || "emoções mistas"}</span></h3>
                    <p className="text-lg text-indigo-100 leading-relaxed mb-6">
                      Detetámos uma carga emocional de {lastResult.ai_analysis?.intensidade || "?"}/5. 
                      Lembra-te: todas as emoções são válidas. Que tal dares uma vista de olhos nesta sugestão?
                    </p>
                  </div>
                  
                  {lastResult.sugestao && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full md:w-80 shadow-inner">
                      <div className="flex items-center gap-2 mb-4">
                        {lastResult.sugestao.tipo_conteudo === 'Vídeo' ? <Video size={20} /> : <BookOpen size={20} />}
                        <span className="font-black text-xs uppercase">{lastResult.sugestao.tipo_conteudo}</span>
                      </div>
                      <p className="font-bold text-lg mb-6 leading-snug">"{lastResult.sugestao.conteudo_texto}"</p>
                      {lastResult.sugestao.url_externo && (
                        <a href={lastResult.sugestao.url_externo} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-300 font-black hover:text-white transition-colors">
                          EXPLORAR AGORA <ChevronRight size={18} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* HISTÓRICO */}
            <section className="space-y-6">
              <h3 className="text-xl font-black flex items-center gap-2 text-slate-400">
                <Calendar size={20} /> HISTÓRICO DE BEM-ESTAR
              </h3>
              <div className="grid gap-4">
                {userHistory.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-3xl border-2 border-dashed border-slate-100 text-slate-300 font-medium">Ainda não tens registos ou o servidor está offline.</div>
                ) : userHistory.map(h => (
                  <div key={h.id_registo} className="bg-white p-6 rounded-[1.5rem] flex items-center justify-between shadow-sm border border-slate-50 hover:border-indigo-100 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="text-3xl bg-slate-50 w-14 h-14 flex items-center justify-center rounded-2xl">
                        {h.emoji_selecionado?.[0] || '📝'}
                      </div>
                      <div>
                        <p className="font-black text-slate-800">{new Date(h.timestamp).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long' })}</p>
                        <p className="text-slate-400 text-sm truncate max-w-[200px] md:max-w-md">{h.texto_livre}</p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${
                      h.categoria_emocional === 'Alegria' ? 'bg-emerald-50 text-emerald-600' :
                      h.categoria_emocional === 'Tristeza' ? 'bg-sky-50 text-sky-600' :
                      h.categoria_emocional === 'Estresse' ? 'bg-rose-50 text-rose-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {h.categoria_emocional}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* COLUNA DIREITA: BIBLIOTECA */}
          <aside className="space-y-8">
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <BookOpen className="text-indigo-600" /> Biblioteca
              </h3>
              <div className="space-y-4">
                {suggestions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Sem sugestões disponíveis.</p>
                ) : suggestions.slice(0, 6).map(s => (
                  <div key={s.id_sugestao} className="p-4 rounded-2xl hover:bg-slate-50 transition-colors group cursor-default">
                    <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">{s.tipo_conteudo}</p>
                    <p className="text-sm font-bold text-slate-600 group-hover:text-slate-900 leading-tight">{s.conteudo_texto}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="bg-indigo-50 p-8 rounded-[2.5rem] text-center border-2 border-indigo-100">
              <p className="text-indigo-600 font-black text-sm mb-2 italic">Dica Moodi</p>
              <p className="text-indigo-900 text-sm font-medium">Escrever sobre o teu dia ajuda a reduzir o stress em 40%.</p>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}