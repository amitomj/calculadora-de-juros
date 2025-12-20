
import React, { useState } from 'react';
import { getDevaluationCoefficient } from '../services/calcService';

const DevaluationCalculator: React.FC = () => {
  const [value, setValue] = useState<number>(10);
  const [year, setYear] = useState<number>(1903);
  
  const coefficient = getDevaluationCoefficient(year);
  const result = value * coefficient;

  return (
    <div className="bg-white dark:bg-moon-card p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-moon-border transition-all">
      <div className="flex items-center gap-2 mb-6">
        <svg width="20" height="20" className="text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Atualização</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Valor Histórico</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
            <input 
              type="number"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-moon-border rounded-xl text-base md:text-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ano</label>
          <input 
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-moon-border rounded-xl text-base md:text-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
            placeholder="Ex: 1974"
          />
        </div>
      </div>

      <div className="mt-8 md:mt-10 p-6 md:p-8 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-slate-500 dark:text-blue-300/60 font-medium text-xs block uppercase">Coeficiente</span>
            <span className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400">{coefficient.toLocaleString('pt-PT')}</span>
          </div>
          <div className="space-y-1 md:text-right">
            <span className="text-slate-500 dark:text-blue-300/60 font-medium text-xs block uppercase">Valor Atualizado (2015)</span>
            <span className="text-3xl md:text-4xl font-extrabold text-blue-800 dark:text-blue-300 tracking-tight break-all">
              {result.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-moon-border">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
            * Cálculo efetuado multiplicando o capital pelo coeficiente oficial do ano respetivo.
          </p>
        </div>
        <div className="md:col-span-2 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20">
          <p className="text-[10px] text-amber-700 dark:text-amber-400 flex items-start gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            Para anos posteriores a 2015, a lei aplica o último coeficiente disponível (1,00).
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevaluationCalculator;
