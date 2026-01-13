import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Smile, Heart, Send, LogOut, 
  AlertCircle, RefreshCw, WifiOff
} from 'lucide-react';

// IMPORTAÇÃO DO ESTILO
import './App.css'; 

/**
 * 🔗 CONFIGURAÇÃO DA API
 * Este link liga o teu Frontend ao Servidor no Render.
 */
const API_URL = 'https://moodi-nnkb.onrender.com'; 

export default function App() {
  // Estados de controlo de página e utilizador
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); 
  const [email, setEmail] = useState('aluno.demo@ipmaia.pt');
  
  // Estados de feedback e carregamento
  const [error, setError] = useState(null);
  const [isWakingUp, setIsWakingUp] = useState(false);
  
  // Estados do Diário
  const [text, setText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);

  // Tenta "acordar" o Render assim que o site abre
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

  // Carrega o histórico de registos sempre que o utilizador entra
  useEffect(() => {
    if (user && user.id_utilizador) {
      axios.get(`${API_URL}/journal/${user.id_utilizador}`)
        .then(res => setHistory(res.data))
        .catch(err => console.error("Erro ao carregar histórico:", err));
    }
  }, [user]);

  // Função de Login (Lógica Find-or-Create)
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
      setError("Erro de ligação: O servidor no Render não respondeu.");
    }
  };

  // Enviar novo desabafo para análise de IA
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
      // Atualiza a lista após o sucesso
      const hRes = await axios.get(`${API_URL}/journal/${user.id_utilizador}`);
      setHistory(hRes.data);
    } catch (err) {
      setError("Falha ao guardar o teu registo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * ECRÃ DE LOGIN
   */
  if (page === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 fade-in">
        <div className="bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Smile size={45} className="text-indigo-600" />
          </div>
          
          <h1 className="text-5xl font-black text-slate-800 mb-2">Moodi</h1>
          <p className="text-slate-400 font-medium mb-10 italic">O teu diário inteligente.</p>
          
          {isWakingUp && (
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mb-8 flex items-center gap-3 animate-pulse text-left">
              <WifiOff className="text-amber-500" size={18} />
              <p className="text-amber-700 text-[11px] leading-tight font-semibold">
                O servidor está a acordar no Render.<br/>Pode demorar uns segundos...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-xs flex items-center gap-2 border border-red-100">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-semibold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@ipmaia.pt"
              required
            />
            <button className="w-full btn-premium text-white p-5 rounded-2xl font-bold text-lg">
              Entrar no Diário
            </button>
          </form>
        </div>
      </div>
    );
  }

  /**
   * DASHBOARD PRINCIPAL
   */
  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center glass-card p-6 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-2xl tracking-tighter">
             MOODI
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
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

        {/* Registo de Hoje */}
        <main className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100">
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-slate-800">
            <Heart size={32} className="text-red-500" fill="currentColor" /> 
            Como te sentes hoje?
          </h2>
          
          <div className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
              {['😊', '😢', '😡', '😴', '🤔', '😐', '🥳'].map(e => (
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
             className="w-full p-8 bg-slate-50 rounded-[2rem] border-none outline-none h-48 focus:ring-4 focus:ring-indigo-50 transition-all text-xl"
             placeholder="Desabafa aqui..."
             value={text}
             onChange={(e) => setText(e.target.value)}
          />

          <button 
            onClick={handleSendEntry}
            disabled={isAnalyzing || !text || !selectedEmoji}
            className="mt-10 w-full btn-premium text-white p-6 rounded-[2rem] font-bold text-xl flex items-center justify-center gap-3 disabled:opacity-30"
          >
            {isAnalyzing ? <RefreshCw className="animate-spin" /> : "Analisar o meu dia"}
          </button>
        </main>

        {/* Histórico */}
        <section className="space-y-6">
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest px-4">Histórico Recente</h3>
          <div className="grid gap-4">
            {history.map(h => (
              <div key={h.id_registo} className="flex justify-between items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-all">
                 <div className="flex items-center gap-6 min-w-0">
                    <span className="text-4xl bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl">
                      {h.emoji_selecionado?.[0] || '📝'}
                    </span>
                    <div className="truncate">
                      <p className="text-slate-700 font-bold text-lg truncate pr-4">{h.texto_livre}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                        {new Date(h.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                 </div>
                 <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl shrink-0 badge-${h.categoria_emocional?.toLowerCase()}`}>
                  {h.categoria_emocional}
                 </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}