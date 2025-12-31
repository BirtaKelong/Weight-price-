
import React, { useState, useEffect } from 'react';
import { CalculationResult } from '../types';

export const History: React.FC = () => {
  const [history, setHistory] = useState<CalculationResult[]>([]);

  const loadHistory = () => {
    const saved = JSON.parse(localStorage.getItem('calc_history') || '[]');
    setHistory(saved);
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener('storage_update', loadHistory);
    return () => window.removeEventListener('storage_update', loadHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('calc_history');
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Recent Calculations
        </h3>
        <button 
          onClick={clearHistory}
          className="text-[10px] sm:text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-tighter"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {history.map((calc) => (
          <div 
            key={calc.id} 
            className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col xs:flex-row items-start xs:items-center justify-between hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors gap-3"
          >
            <div className="flex items-center gap-3 sm:gap-4 w-full xs:w-auto">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <i className="fas fa-history text-[10px] sm:text-xs"></i>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base truncate">
                  {calc.weight} {calc.weightUnit} @ ₹{calc.pricePerUnit}/{calc.priceUnit}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-400">
                  {new Date(calc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {calc.totalWeightKg.toFixed(2)}kg
                </p>
              </div>
            </div>
            <div className="w-full xs:w-auto text-left xs:text-right border-t xs:border-t-0 border-slate-50 dark:border-slate-700/50 pt-2 xs:pt-0">
              <p className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400 break-all">
                ₹{calc.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
