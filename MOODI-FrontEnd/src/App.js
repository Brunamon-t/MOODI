import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Smile, Heart, Send, LogOut, Sparkles, 
  AlertCircle, RefreshCw, WifiOff, Calendar, User
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

  // --- EFEITOS ---

  useEffect(() => {
    const pingServer = async () => {
      try {
        await axios.get(`${API_URL}/api/sugestoes`, { timeout: 15000 });
        setIsWakingUp(false);
      } catch (err) {
        setIsWakingUp(true);
      }
    };
    pingServer();
  }, []);

  useEffect(() => {
    if (user && user.id_utilizador) {
      axios.get(`${API_URL}/journal/${user.id_utilizador}`)
        .then(res => setHistory(res.data))
        .catch(err => console.error("Erro histórico:", err));
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
      if (err.message === "Network Error") {
        setError("Servidor indisponível. Verifique a ligação ao Render.");
      } else {
        setError(`Falha na autenticação: ${err.response?.data?.error || "Erro interno"}`);
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
      setError("Não foi possível processar o registo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="moodi-app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .moodi-app-container {
          font-family: 'Inter', sans-serif;
          background-color: #fcfcfd;
          min-height: 100vh;
          color: #1a1c21;
          -webkit-font-smoothing: antialiased;
        }

        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        /* UI Elements */
        .card-pro {
          background: #ffffff;
          border: 1px solid #e4e7ec;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(16, 24, 40, 0.1), 0 1px 2px rgba(16, 24, 40, 0.06);
        }

        .input-pro {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #d0d5dd;
          font-size: 16px;
          transition: all 0.2s;
          outline: none;
        }

        .input-pro:focus {
          border-color: #444ce7;
          box-shadow: 0 0 0 4px rgba(68, 76, 231, 0.1);
        }

        .btn-pro {
          background: #444ce7;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-pro:hover { background: #3538cd; }
        .btn-pro:disabled { background: #eaecf0; color: #98a2b3; cursor: not-allowed; }

        .emoji-pro-btn {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          border: 1px solid #f2f4f7;
          background: #f9fafb;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          cursor: pointer;
        }

        .emoji-pro-btn:hover { border-color: #d0d5dd; background: #fff; transform: translateY(-2px); }
        .emoji-pro-btn.active { border-color: #444ce7; background: #eef4ff; box-shadow: 0 0 0 3px rgba(68, 76, 231, 0.1); }

        /* Status Badges */
        .status-badge {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          text-transform: capitalize;
        }
        .alegria { background: #ecfdf3; color: #027a48; }
        .tristeza { background: #eff8ff; color: #175cd3; }
        .estresse { background: #fff1f3; color: #c01048; }
        .calma { background: #f9f5ff; color: #6941c0; }
        .neutro { background: #f2f4f7; color: #344054; }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {page === 'login' ? (
        /* --- PROFESSIONAL LOGIN --- */
        <div className="min-h-screen flex flex-col items-center justify-center p-6 fade-in bg-slate-50">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                <Sparkles size={24} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bem-vindo ao Moodi</h1>
              <p className="text-slate-500 mt-2">A sua plataforma de monitorização emocional.</p>
            </div>

            <div className="card-pro p-8">
              {isWakingUp && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
                  <RefreshCw size={18} className="text-blue-600 animate-spin" />
                  <p className="text-blue-700 text-sm font-medium">Ligar à rede segura Moodi...</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3">
                  <AlertCircle size={18} className="text-red-600" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail Institucional</label>
                  <input 
                    type="email" 
                    className="input-pro"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teu.nome@ipmaia.pt"
                    required
                  />
                </div>
                <button type="submit" className="w-full btn-pro">
                  Aceder ao Diário
                </button>
              </form>
            </div>
            <p className="text-center text-xs text-slate-400 mt-8 font-medium uppercase tracking-widest">
              Conectado a: {API_URL.split('//')[1]}
            </p>
          </div>
        </div>
      ) : (
        /* --- PROFESSIONAL DASHBOARD --- */
        <div className="fade-in">
          {/* Top Navigation */}
          <nav className="border-b bg-white sticky top-0 z-30">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="font-bold text-lg text-slate-900 tracking-tight">Moodi</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 py-1.5 px-3 bg-slate-50 rounded-lg border">
                  <User size={14} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-600">{user?.pseudonimo}</span>
                </div>
                <button 
                  onClick={() => { setUser(null); setPage('login'); }} 
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </nav>

          <main className="max-w-5xl mx-auto p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Writing Area */}
              <div className="lg:col-span-7 space-y-6">
                <div className="card-pro p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                    <h2 className="text-xl font-bold text-slate-900">Novo Registo</h2>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Qual o seu estado atual?</p>
                    <div className="flex flex-wrap gap-3">
                      {['😊', '😢', '😡', '😴', '🤔', '😐', '🥳', '😨'].map(e => (
                        <button 
                          key={e} 
                          onClick={() => setSelectedEmoji(e)}
                          className={`emoji-pro-btn ${selectedEmoji === e ? 'active' : ''}`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Desabafo ou Reflexão</label>
                    <textarea 
                       className="input-pro h-40 resize-none leading-relaxed"
                       placeholder="Como correu o seu dia? O que está a sentir agora?"
                       value={text}
                       onChange={(e) => setText(e.target.value)}
                    />
                  </div>

                  <button 
                    onClick={handleSendEntry}
                    disabled={isAnalyzing || !text || !selectedEmoji}
                    className="w-full btn-pro"
                  >
                    {isAnalyzing ? <RefreshCw className="animate-spin" /> : <><Send size={18}/> Submeter Registo</>}
                  </button>
                </div>
              </div>

              {/* Right Column: History & Insights */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Calendar size={18} className="text-slate-400" />
                    Atividade Recente
                  </h3>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                    {history.length} ENTRADAS
                  </span>
                </div>

                <div className="space-y-3">
                  {history.length === 0 ? (
                    <div className="card-pro p-10 text-center border-dashed">
                      <p className="text-slate-400 text-sm font-medium italic">Ainda não existem dados para apresentar.</p>
                    </div>
                  ) : (
                    history.map(h => (
                      <div key={h.id_registo} className="card-pro p-4 flex items-start gap-4 hover:border-indigo-200 transition-colors group">
                        <div className="w-12 h-12 shrink-0 bg-slate-50 rounded-lg flex items-center justify-center text-2xl border group-hover:bg-white transition-colors">
                          {h.emoji_selecionado?.[0] || '📝'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                              {new Date(h.timestamp).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                            <span className={`status-badge ${h.categoria_emocional?.toLowerCase()}`}>
                              {h.categoria_emocional}
                            </span>
                          </div>
                          <p className="text-slate-700 text-sm leading-snug truncate pr-2">{h.texto_livre}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </main>
        </div>
      )}
    </div>
  );
}