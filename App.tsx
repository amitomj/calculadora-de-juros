
import React, { useState, useEffect } from 'react';
import DevaluationCalculator from './components/DevaluationCalculator';
import InterestCalculator from './components/InterestCalculator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'devaluation' | 'interest'>('interest');
  const [theme, setTheme] = useState<'day' | 'moon'>('day');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preferences
  useEffect(() => {
    const saved = localStorage.getItem('app-theme') as 'day' | 'moon' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = saved || (prefersDark ? 'moon' : 'day');
    
    setTheme(initialTheme);
    setMounted(true);
    
    // Apply dark class immediately to avoid flash if needed
    if (initialTheme === 'moon') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Update document class and localStorage when theme changes
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-moon-bg text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20">
      <header className="bg-white dark:bg-moon-card border-b border-slate-200 dark:border-moon-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 shrink-0">
              €
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Calculadora Jurídica</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Portugal</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('interest')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'interest' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Juros de Mora
            </button>
            <button 
              onClick={() => setActiveTab('devaluation')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'devaluation' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Atualização Monetária
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-moon-border mx-2" />
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:ring-2 hover:ring-blue-500 transition-all"
            >
              {theme === 'day' ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-12">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            {activeTab === 'interest' ? 'Cálculo de Juros de Mora' : 'Atualização Monetária'}
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            {activeTab === 'interest' 
              ? 'Ferramenta profissional para o cálculo de juros legais civis, comerciais e dívidas ao Estado em Portugal.' 
              : 'Calcule a desvalorização da moeda com base nos coeficientes oficiais de atualização monetária de 1903 a 2015.'}
          </p>
        </div>

        {activeTab === 'interest' ? <InterestCalculator /> : <DevaluationCalculator />}
      </main>
    </div>
  );
};

export default App;
