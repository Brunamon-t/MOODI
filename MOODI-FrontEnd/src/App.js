import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Smile, Heart, Send, LogOut, Sparkles, 
  AlertCircle, RefreshCw, WifiOff
} from 'lucide-react';

/**
 * 🔗 LINK OFICIAL DO RENDER
 * Removi os ícones 'History' e 'MessageSquare' que causavam o erro no Netlify.
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
        await axios.get(`${API_URL}/api/sugestoes`, { timeout: 15000 });
        setIsWakingUp(false);
      } catch (err) {
        setIsWakingUp(true);
        console.warn("Servidor a acordar...");
      }
    };
    pingServer();
  }, []);

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
      
      const hRes = await axios.get(`${API_URL}/journal/${res.data.user.id_utilizador}`);
      setHistory(hRes.data);
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Erro de rede: O servidor Render não respondeu a tempo.");
    }
  };

  const handleSendEntry = async () => {
    if (!text || !selectedEmoji) return;
    setIsAnalyzing(true);
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
      setError("Erro ao guardar o registo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (page === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl text-center">
          <Smile size={60} className="mx-auto text-indigo-600 mb-6" />
          <h1 className="text-4xl font-black text-slate-800 mb-2">Moodi</h1>
          
          {isWakingUp && (
            <div className="mt-4 bg-amber-50 text-amber-700 p-4 rounded-2xl flex items-center gap-2 animate-pulse text-xs">
              <WifiOff size={16}/> O servidor está a acordar (30-60 seg)...
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle size={16}/> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <input 
              type="email" 
              className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teu.email@ipmaia.pt"
            />
            <button className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-indigo-600"><Heart className="text-red-500"/> O meu Diário</h2>
        <textarea 
           className="w-full p-6 bg-slate-50 rounded-2xl border-none outline-none h-32 focus:ring-2 focus:ring-indigo-500"
           placeholder="Como te sentes hoje?"
           value={text}
           onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-2 mt-4">
            {['😊', '😢', '😡', '😴'].map(e => (
                <button 
                  key={e} 
                  onClick={() => setSelectedEmoji(e)}
                  className={`text-2xl p-4 rounded-xl transition-all ${selectedEmoji === e ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                  {e}
                </button>
            ))}
        </div>
        <button 
          onClick={handleSendEntry}
          disabled={isAnalyzing || !text || !selectedEmoji}
          className="mt-6 w-full bg-indigo-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:bg-slate-200 transition-all"
        >
          {isAnalyzing ? <RefreshCw className="animate-spin"/> : <><Send size={18}/> Guardar Registo</>}
        </button>

        <div className="mt-10 space-y-4">
          <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest">Histórico Recente</h3>
          {history.map(h => (
            <div key={h.id_registo} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-4">
                  <span className="text-2xl">{h.emoji_selecionado?.[0]}</span>
                  <span className="text-slate-600 font-medium">{h.texto_livre}</span>
               </div>
               <span className="text-[10px] font-black uppercase px-2 py-1 bg-indigo-50 text-indigo-500 rounded-lg">{h.categoria_emocional}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}