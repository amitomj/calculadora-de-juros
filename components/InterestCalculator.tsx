import React, { useState, useMemo } from 'react';
import { InterestType, Debt, CalculationResult } from '../types';
import { calculateInterestForDebt } from '../services/calcService';
import { exportToWord } from '../services/exportService';

const InterestCalculator: React.FC = () => {
  const [interestType, setInterestType] = useState<InterestType>(InterestType.CIVIL);
  const [finalDate, setFinalDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', value: 1000, dueDate: '2024-01-01' }
  ]);

  const addDebt = () => {
    setDebts([...debts, { id: Math.random().toString(), value: 0, dueDate: new Date().toISOString().split('T')[0] }]);
  };

  const removeDebt = (id: string) => {
    if (debts.length > 1) {
      setDebts(debts.filter(d => d.id !== id));
    }
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(debts.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const results = useMemo(() => {
    return debts.map(debt => calculateInterestForDebt(debt, finalDate, interestType));
  }, [debts, finalDate, interestType]);

  const totals = useMemo(() => {
    return results.reduce((acc, res) => ({
      capital: acc.capital + res.debt.value,
      interest: acc.interest + res.totalInterest,
      grandTotal: acc.grandTotal + res.totalValue
    }), { capital: 0, interest: 0, grandTotal: 0 });
  }, [results]);

  return (
    <div className="space-y-8">
      {/* Config Section */}
      <div className="bg-white dark:bg-moon-card p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-moon-border">
        <div className="flex items-center gap-2 mb-6">
          <svg width="20" height="20" className="text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Parâmetros de Cálculo</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Tipo de Juros Legal</label>
            <select 
              value={interestType}
              onChange={(e) => setInterestType(e.target.value as InterestType)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-moon-border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all appearance-none cursor-pointer"
            >
              <option value={InterestType.CIVIL}>Juros Civis (4%)</option>
              <option value={InterestType.COMMERCIAL_3}>Comerciais (§3 Art. 102º C.C.)</option>
              <option value={InterestType.COMMERCIAL_5}>Comerciais (§5 Art. 102º C.C.)</option>
              <option value={InterestType.STATE}>Estado e Entidades Públicas</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Data de Referência Final</label>
            <input 
              type="date"
              value={finalDate}
              onChange={(e) => setFinalDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-moon-border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Debts List */}
      <div className="bg-white dark:bg-moon-card p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-moon-border">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" className="text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Discriminação de Dívidas</h3>
          </div>
          <button 
            onClick={addDebt}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
            Adicionar Item
          </button>
        </div>

        <div className="space-y-6">
          {debts.map((debt, idx) => (
            <div key={debt.id} className="p-6 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/40 relative group transition-all hover:border-blue-200 dark:hover:border-blue-900/50">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-5 space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Capital em Dívida #{idx + 1}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                    <input 
                      type="number"
                      value={debt.value}
                      onChange={(e) => updateDebt(debt.id, { value: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-moon-border rounded-xl text-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="md:col-span-4 space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Data de Vencimento</label>
                  <input 
                    type="date"
                    value={debt.dueDate}
                    onChange={(e) => updateDebt(debt.id, { dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-moon-border rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-3 flex items-center justify-between gap-4">
                  <div className="text-right flex-1 bg-blue-50 dark:bg-blue-500/5 p-2 rounded-xl border border-blue-100 dark:border-blue-500/10">
                     <span className="text-[10px] text-blue-500 block font-bold uppercase tracking-wider">Juros Acumulados</span>
                     <span className="text-xl font-bold text-slate-800 dark:text-blue-300">
                      {results[idx].totalInterest.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                     </span>
                  </div>
                  <button 
                    onClick={() => removeDebt(debt.id)}
                    className="text-slate-400 hover:text-red-500 p-2 transition-colors cursor-pointer"
                    title="Remover"
                  >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-slate-900 dark:bg-blue-600 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-blue-500/20 text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
          <div className="flex-1 space-y-6">
            <h4 className="text-blue-400 dark:text-blue-100 text-sm font-bold uppercase tracking-[0.3em]">Resumo Consolidado</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-1">
                <p className="text-slate-400 dark:text-blue-100/60 text-xs font-semibold uppercase tracking-wider">Total Capital</p>
                <p className="text-3xl font-bold">{totals.capital.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 dark:text-blue-100/60 text-xs font-semibold uppercase tracking-wider">Total de Juros</p>
                <p className="text-3xl font-bold text-yellow-400 dark:text-white">{totals.interest.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right space-y-6">
            <div className="space-y-1">
              <p className="text-slate-400 dark:text-blue-100/60 text-xs font-bold uppercase tracking-[0.2em]">Montante Total Bruto</p>
              <p className="text-5xl font-black text-white tracking-tighter">
                {totals.grandTotal.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
              </p>
            </div>
            
            <button 
              onClick={() => exportToWord(results, interestType, finalDate)}
              className="bg-white text-slate-900 dark:bg-moon-card dark:text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl mx-auto md:ml-auto cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              GERAR RELATÓRIO WORD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestCalculator;