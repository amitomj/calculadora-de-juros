import React, { useState, useEffect } from 'react';
import DevaluationCalculator from './components/DevaluationCalculator';
import InterestCalculator from './components/InterestCalculator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'devaluation' | 'interest'>('interest');
  const [theme, setTheme] = useState<'day' | 'moon'>('day');
  const [mounted, setMounted] = useState(false);

  // 1. Inicializar o tema a partir do localStorage ou sistema
  useEffect(() => {
    const saved = localStorage.getItem('app-theme') as 'day' | 'moon' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = saved || (prefersDark ? 'moon' : 'day');
    
    setTheme(initialTheme);
    
    // Aplicar a classe imediatamente para evitar flash de luz
    if (initialTheme === 'moon') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setMounted(true);
  }, []);

  // 2. Sincronizar tema quando o estado 'theme' muda
  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    if (theme === 'moon') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('app-theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'day' ? 'moon' : 'day');
  };

  // Não renderiza nada até o tema inicial estar definido para evitar saltos de layout
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-moon-bg transition-colors duration-300 pb-20">
      <header className="bg-white dark:bg-moon-card border-b border-slate-200 dark:border-moon-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
              €
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Calculadora Jurídica</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Portugal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('interest')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === 'interest' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                Juros de Mora
              </button>
              <button 
                onClick={() => setActiveTab('devaluation')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === 'devaluation' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                Desvalorização
              </button>
            </nav>

            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent dark:border-moon-border cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
              aria-label="Alternar tema"
            >
              {theme === 'day' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Calculadora: {activeTab === 'interest' ? 'Juros de Mora' : 'Desvalorização Moeda'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            Ferramenta profissional para cálculos jurídicos precisos de acordo com a lei portuguesa.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'devaluation' ? (
            <DevaluationCalculator />
          ) : (
            <InterestCalculator />
          )}
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 mt-16 pt-8 border-t border-slate-200 dark:border-moon-border text-slate-400 dark:text-slate-500 text-sm flex flex-col md:flex-row justify-between gap-4 pb-10">
        <p>&copy; {new Date().getFullYear()} Calculadora Jurídica PT. Portugal • Suporte Legal.</p>
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5 italic">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sistema Online
          </span>
          <span>Versão 1.2.9</span>
        </div>
      </footer>
    </div>
  );
};

export default App;