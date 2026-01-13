import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Smile, Heart, Send, LogOut, Sparkles, 
  AlertCircle, RefreshCw, WifiOff
} from 'lucide-react';

/**
 * 🔗 LINK OFICIAL DA TUA API NO RENDER
 */
const API_URL = 'https://moodi-nnkb.onrender.com'; 

export default function App() {
  // --- ESTADOS ---
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); 
  const [email, setEmail] = useState('aluno.demo@ipmaia.pt');
  const [error, setError] = useState(null);
  const [isWakingUp, setIsWakingUp] = useState(false);
  
  const [text, setText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);

  // --- EFEITOS (COMUNICAÇÃO CLOUD) ---

  // Tenta "acordar" o Render logo ao abrir o site
  useEffect(() => {
    const pingServer = async () => {
      try {
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

  // --- AÇÕES ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/callback`, {
        id_externo_auth: `manual_${email.split('@')[0]}`, 
        email,
        pseudonimo: email.split('@')[0]
      });
      setUser(res.data.user);
      setPage('dashboard');
    } catch (err) {
      console.error("Erro no login:", err);
      if (err.message === "Network Error") {
        setError("Erro de Rede: O browser não consegue chegar à API. Verifica o HTTPS.");
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
      // Atualiza o histórico
      const hRes = await axios.get(`${API_URL}/journal/${user.id_utilizador}`);
      setHistory(hRes.data);
    } catch (err) {
      setError("Falha ao guardar: " + (err.response?.data?.error || err.message));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="moodi-app-container">
      {/* 🎨 ESTILOS PREMIUM INTEGRADOS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;800&display=swap');

        .moodi-app-container {
          font-family: 'Urbanist', sans-serif;
          background-color: #f8fafc;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .btn-premium {
          background: linear-gradient(135deg, #6366f1, #a78bfa);
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.4);
        }

        .btn-premium:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .emoji-btn {
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .emoji-btn:hover {
          transform: scale(1.15);
          background-color: white !important;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        /* Cores das Badges por Categoria */
        .badge-alegria { background: #dcfce7; color: #166534; }
        .badge-tristeza { background: #e0f2fe; color: #075985; }
        .badge-estresse { background: #fee2e2; color: #991b1b; }
        .badge-calma { background: #f0fdf4; color: #166534; }
        .badge-raiva { background: #fef2f2; color: #991b1b; }
        .badge-neutro { background: #f1f5f9; color: #475569; }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {page === 'login' ? (
        /* --- ECRÃ DE LOGIN --- */
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 fade-in">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Smile size={45} className="text-indigo-600" />
            </div>
            
            <h1 className="text-5xl font-extrabold text-slate-800 mb-2 tracking-tight">Moodi</h1>
            <p className="text-slate-400 font-medium mb-8">O teu refúgio inteligente na nuvem.</p>
            
            {isWakingUp && (
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mb-8 flex items-center gap-3 animate-pulse text-left">
                <WifiOff className="text-amber-500 shrink-0" size={18} />
                <p className="text-amber-700 text-[11px] leading-tight font-semibold">
                  O servidor Render está a acordar (30-60 seg).<br/>Por favor, aguarda...
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-xs flex items-center gap-2 border border-red-100 text-left">
                <AlertCircle size={16} className="shrink-0"/> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">E-mail Institucional</label>
              <input 
                type="email" 
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-semibold text-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@ipmaia.pt"
                required
              />
              <button className="w-full btn-premium p-5 rounded-2xl font-bold text-lg mt-4">
                Entrar no Diário
              </button>
            </form>
            
            <p className="mt-8 text-[9px] text-slate-300 uppercase tracking-[0.2em] font-mono">
              API: {API_URL}
            </p>
          </div>
        </div>
      ) : (
        /* --- DASHBOARD PRINCIPAL --- */
        <div className="min-h-screen p-4 md:p-10 fade-in">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header Elegante */}
            <header className="flex justify-between items-center glass-card p-6 rounded-[2rem] shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-2xl tracking-tighter">
                <Sparkles size={24} fill="currentColor" /> MOODI
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-full hidden sm:inline">
                  {user?.pseudonimo}
                </span>
                <button 
                  onClick={() => { setUser(null); setPage('login'); }} 
                  className="p-3 rounded-2xl bg-white text-slate-400 hover:text-red-500 hover:shadow-md transition-all border border-slate-100"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </header>

            {/* Input Principal */}
            <main className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100">
              <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-slate-800">
                <Heart size={32} className="text-red-500" fill="currentColor" /> 
                Como te sentes hoje?
              </h2>
              
              <div className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                  {['😊', '😢', '😡', '😴', '🤔', '😐', '🥳', '😨'].map(e => (
                      <button 
                        key={e} 
                        onClick={() => setSelectedEmoji(e)}
                        className={`emoji-btn text-4xl w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] flex items-center justify-center ${
                          selectedEmoji === e ? 'bg-indigo-600 text-white shadow-xl scale-110' : 'bg-slate-50 text-slate-400'
                        }`}
                      >
                        {e}
                      </button>
                  ))}
              </div>

              <textarea 
                 className="w-full p-8 bg-slate-50 rounded-[2rem] border-none outline-none h-48 focus:ring-4 focus:ring-indigo-50 transition-all text-xl text-slate-700 placeholder:text-slate-300"
                 placeholder="Escreve o que te vai na alma..."
                 value={text}
                 onChange={(e) => setText(e.target.value)}
              />

              <button 
                onClick={handleSendEntry}
                disabled={isAnalyzing || !text || !selectedEmoji}
                className="mt-10 w-full btn-premium p-6 rounded-[2rem] font-bold text-xl flex items-center justify-center gap-3"
              >
                {isAnalyzing ? <RefreshCw className="animate-spin" /> : <><Send size={24}/> Analisar o meu dia</>}
              </button>
            </main>

            {/* Histórico com Badges */}
            <section className="space-y-6">
              <h3 className="font-bold text-slate-400 uppercase text-xs tracking-[0.2em] px-4">Histórico Recente</h3>
              <div className="grid gap-4">
                {history.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100 text-slate-300 italic">
                    Ainda não tens registos guardados. Começa a escrever acima!
                  </div>
                ) : (
                  history.map(h => (
                    <div key={h.id_registo} className="flex justify-between items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-all group">
                       <div className="flex items-center gap-6 min-w-0">
                          <span className="text-4xl bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-indigo-50 transition-colors">
                            {h.emoji_selecionado?.[0] || '📝'}
                          </span>
                          <div className="truncate pr-4">
                            <p className="text-slate-700 font-bold text-lg truncate">{h.texto_livre}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mt-1">
                              {new Date(h.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                       </div>
                       <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl shrink-0 badge-${h.categoria_emocional?.toLowerCase()}`}>
                        {h.categoria_emocional}
                       </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

