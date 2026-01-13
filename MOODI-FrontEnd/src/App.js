import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Smile, Heart, Send, LogOut, 
  AlertCircle, RefreshCw, WifiOff
} from 'lucide-react';


import './App.css';

/**
 * 🔗 LINK OFICIAL DO RENDER
 * Verifica se este URL é exatamente o que aparece no teu Dashboard do Render.
 */
const API_URL = 'https://moodi-nnkb.onrender.com'; 

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); 
  const [email, setEmail] = useState('aluno.demo@ipmaia.pt');
  const [error, setError] = useState(null);
  const [isWakingUp, setIsWakingUp] = useState(false);
  
  const [text, setText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);

  // Tenta "acordar" o Render logo ao abrir o site
  useEffect(() => {
    const pingServer = async () => {
      try {
        // Tentamos aceder ao status para ver se a API responde
        await axios.get(`${API_URL}/api/sugestoes`, { timeout: 15000 });
        setIsWakingUp(false);
      } catch (err) {
        setIsWakingUp(true);
        console.warn("A aguardar resposta do Render...");
      }
    };
    pingServer();
  }, []);

  // Carrega o histórico quando o utilizador faz login
  useEffect(() => {
    if (user && user.id_utilizador) {
      axios.get(`${API_URL}/journal/${user.id_utilizador}`)
        .then(res => setHistory(res.data))
        .catch(err => console.error("Erro ao carregar histórico:", err));
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      /**
       * 🛠️ AJUSTE: Enviamos o id_externo_auth explicitamente para evitar erros de validação
       * O backend espera que este campo exista para criar ou encontrar o utilizador.
       */
      const res = await axios.post(`${API_URL}/auth/callback`, {
        id_externo_auth: `manual_${email.split('@')[0]}`, 
        email,
        pseudonimo: email.split('@')[0]
      });
      setUser(res.data.user);
      setPage('dashboard');
    } catch (err) {
      console.error("Erro detalhado no login:", err);
      // Diagnóstico inteligente do erro
      if (err.message === "Network Error") {
        setError("Erro de Rede: O browser não consegue chegar à API. Verifica o HTTPS ou se o CORS está ativo no Backend.");
      } else if (err.response?.status === 500) {
        setError("Erro 500: O servidor Render está vivo, mas não consegue ligar-se à Base de Dados (Neon).");
      } else {
        setError(`Erro: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  const handleSendEntry = async () => {
    if (!text || !selectedEmoji || !user) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/journal`, {
        fk_utilizador: user.id_utilizador,
        emoji_selecionado: [selectedEmoji],
        texto_livre: text
      });
      setText('');
      setSelectedEmoji(null);
      const hRes = await axios.get(`${API_URL}/journal/${user.id_utilizador}`);
      setHistory(hRes.data);
    } catch (err) {
      setError("Falha ao guardar: " + (err.response?.data?.error || err.message));
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (page === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl text-center">
          <Smile size={60} className="mx-auto text-indigo-600 mb-6" />
          <h1 className="text-4xl font-black text-slate-800 mb-2">Moodi</h1>
          
          {isWakingUp && (
            <div className="mt-4 bg-amber-50 text-amber-700 p-4 rounded-2xl flex items-center gap-2 animate-pulse text-xs text-left">
              <WifiOff size={16} className="shrink-0"/> 
              <span>O servidor gratuito do Render demora cerca de 50s a "acordar". Aguarda um momento...</span>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-2xl text-xs flex items-center gap-2 text-left border border-red-100">
              <AlertCircle size={16} className="shrink-0"/> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <input 
              type="email" 
              className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teu.email@ipmaia.pt"
              required
            />
            <button className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95">
              Entrar no Diário
            </button>
          </form>
          
          <p className="mt-6 text-[10px] text-slate-300 uppercase tracking-widest">
            API: {API_URL}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-2xl tracking-tighter">
            MOODI
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-500 hidden sm:inline">{user?.pseudonimo}</span>
            <button 
              onClick={() => { setUser(null); setPage('login'); }} 
              className="p-3 rounded-xl bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-slate-800">
            <Heart size={24} className="text-red-500" fill="currentColor"/> Como te sentes hoje?
          </h2>
          
          <textarea 
             className="w-full p-6 bg-slate-50 rounded-2xl border-none outline-none h-32 focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
             placeholder="Escreve aqui o teu desabafo..."
             value={text}
             onChange={(e) => setText(e.target.value)}
          />

          <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {['😊', '😢', '😡', '😴', '🤔', '😐'].map(e => (
                  <button 
                    key={e} 
                    onClick={() => setSelectedEmoji(e)}
                    className={`text-3xl w-16 h-16 rounded-2xl transition-all flex items-center justify-center ${
                      selectedEmoji === e ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'bg-slate-50 hover:bg-slate-100 text-slate-400'
                    }`}
                  >
                    {e}
                  </button>
              ))}
          </div>

          <button 
            onClick={handleSendEntry}
            disabled={isAnalyzing || !text || !selectedEmoji}
            className="mt-8 w-full bg-indigo-600 text-white p-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 disabled:bg-slate-200 transition-all active:scale-95"
          >
            {isAnalyzing ? <RefreshCw className="animate-spin"/> : <><Send size={20}/> Guardar no Diário</>}
          </button>
        </main>

        <section className="space-y-4">
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest px-2">Histórico Recente</h3>
          <div className="grid gap-3">
            {history.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100 text-slate-300 italic">
                Ainda não tens registos guardados.
              </div>
            ) : (
              history.map(h => (
                <div key={h.id_registo} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-all">
                   <div className="flex items-center gap-4 min-w-0">
                      <span className="text-3xl bg-slate-50 w-14 h-14 flex items-center justify-center rounded-xl shrink-0">
                        {h.emoji_selecionado?.[0] || '📝'}
                      </span>
                      <div className="truncate">
                        <p className="text-slate-700 font-medium truncate">{h.texto_livre}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">{new Date(h.timestamp).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <span className="text-[10px] font-black uppercase px-3 py-1.5 bg-indigo-50 text-indigo-500 rounded-lg shrink-0">
                    {h.categoria_emocional}
                   </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}