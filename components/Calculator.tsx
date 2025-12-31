
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Unit, CalculationResult } from '../types';

export const Calculator: React.FC = () => {
  const [weightValue, setWeightValue] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<Unit>('kg');
  const [priceValue, setPriceValue] = useState<string>('');
  const [priceUnit, setPriceUnit] = useState<Unit>('kg');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const prevAmountRef = useRef<number>(0);

  const stats = useMemo(() => {
    const w = parseFloat(weightValue) || 0;
    const p = parseFloat(priceValue) || 0;

    let totalWeightGrams = 0;
    let totalWeightKg = 0;

    if (weightUnit === 'kg') {
      totalWeightKg = w;
      totalWeightGrams = w * 1000;
    } else {
      totalWeightGrams = w;
      totalWeightKg = w / 1000;
    }

    let totalAmount = 0;
    if (priceUnit === 'kg') {
      totalAmount = totalWeightKg * p;
    } else {
      totalAmount = totalWeightGrams * p;
    }

    return {
      totalWeightGrams,
      totalWeightKg,
      totalAmount,
      isValid: w > 0 && p > 0
    };
  }, [weightValue, weightUnit, priceValue, priceUnit]);

  // Trigger subtle pop animation when result changes
  useEffect(() => {
    if (stats.totalAmount !== prevAmountRef.current && stats.totalAmount > 0) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 150);
      prevAmountRef.current = stats.totalAmount;
      return () => clearTimeout(timer);
    }
  }, [stats.totalAmount]);

  const handleReset = () => {
    setWeightValue('');
    setPriceValue('');
    setShowSuccess(false);
  };

  const handleSave = async () => {
    if (!stats.isValid || isSaving) return;

    setIsSaving(true);
    
    // Simulate a brief processing time for better UX perception
    await new Promise(resolve => setTimeout(resolve, 600));

    const newCalc: CalculationResult = {
      id: Math.random().toString(36).substr(2, 9),
      weight: parseFloat(weightValue),
      weightUnit,
      pricePerUnit: parseFloat(priceValue),
      priceUnit,
      totalWeightGrams: stats.totalWeightGrams,
      totalWeightKg: stats.totalWeightKg,
      totalAmount: stats.totalAmount,
      timestamp: Date.now()
    };

    const savedHistory = JSON.parse(localStorage.getItem('calc_history') || '[]');
    const updatedHistory = [newCalc, ...savedHistory].slice(0, 5);
    localStorage.setItem('calc_history', JSON.stringify(updatedHistory));
    
    // Trigger window event to update History component
    window.dispatchEvent(new Event('storage_update'));
    
    setIsSaving(false);
    setShowSuccess(true);
    
    // Hide success icon after a while
    setTimeout(() => setShowSuccess(false), 2400);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-700 p-5 sm:p-8 space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
        {/* Weight Input */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-widest">
            Enter Weight
          </label>
          <div className="flex relative group">
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={weightValue}
              onChange={(e) => {
                setWeightValue(e.target.value);
                setShowSuccess(false);
              }}
              className="w-full text-2xl sm:text-3xl font-black bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-inner"
            />
            <div className="absolute right-2.5 top-2.5 bottom-2.5 flex">
              <button
                onClick={() => setWeightUnit(u => u === 'kg' ? 'g' : 'kg')}
                className="bg-indigo-600 text-white px-4 rounded-xl font-black text-xs sm:text-sm shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-90 transition-all uppercase"
              >
                {weightUnit}
              </button>
            </div>
          </div>
          <div className="flex justify-between px-1 text-[10px] sm:text-xs font-bold text-slate-400">
             <span className="flex items-center gap-1.5">
               <i className="fas fa-exchange-alt opacity-50"></i>
               {weightUnit === 'kg' ? `${stats.totalWeightGrams.toLocaleString()} g` : `${stats.totalWeightKg.toFixed(3)} kg`}
             </span>
          </div>
        </div>

        {/* Price Input */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-widest">
            Price per {priceUnit === 'kg' ? 'kg' : 'gram'}
          </label>
          <div className="flex relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 font-black text-2xl group-focus-within:text-indigo-500 transition-colors">₹</div>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={priceValue}
              onChange={(e) => {
                setPriceValue(e.target.value);
                setShowSuccess(false);
              }}
              className="w-full text-2xl sm:text-3xl font-black bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 rounded-2xl pl-12 pr-4 py-4 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-inner"
            />
            <div className="absolute right-2.5 top-2.5 bottom-2.5 flex">
              <button
                onClick={() => setPriceUnit(u => u === 'kg' ? 'g' : 'kg')}
                className="bg-purple-600 text-white px-4 rounded-xl font-black text-xs sm:text-sm shadow-lg shadow-purple-200 dark:shadow-none hover:bg-purple-700 active:scale-90 transition-all uppercase"
              >
                / {priceUnit}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Result Card */}
      <div 
        className={`bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden group transition-all duration-500
          ${isSaving ? 'scale-95 brightness-90 saturate-50' : 'scale-100'}
          ${isUpdating ? 'scale-[1.02] shadow-indigo-300/50' : ''}
          ${showSuccess ? 'ring-4 ring-emerald-400 ring-offset-4 ring-offset-white dark:ring-offset-slate-800' : ''}
        `}
      >
        <div className={`absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-1000 ${isSaving ? 'animate-pulse' : ''}`}></div>
        <div className={`absolute -left-12 -bottom-12 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl transition-all duration-1000 ${isUpdating ? 'scale-150' : ''}`}></div>
        
        {isSaving && (
          <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-in fade-in duration-300">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin mb-3"></div>
            <span className="font-bold text-sm tracking-widest uppercase">Processing</span>
          </div>
        )}

        <div className="relative z-1">
          <div className="flex justify-between items-start">
            <p className="text-indigo-100 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-2">Total Amount Payable</p>
            {showSuccess && (
              <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/30 animate-in slide-in-from-right duration-300">
                <i className="fas fa-check-circle text-emerald-300 animate-bounce"></i>
                <span className="text-[10px] font-black uppercase">Saved to History</span>
              </div>
            )}
          </div>
          <div className={`flex items-baseline gap-1 sm:gap-2 transition-transform duration-200 ${isUpdating ? 'scale-105' : 'scale-100'}`}>
            <span className="text-4xl sm:text-6xl font-black tracking-tight break-all">₹ {stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
             <div className="overflow-hidden space-y-1">
                <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider opacity-80">Net Weight</p>
                <div className="flex items-center gap-2">
                   <i className="fas fa-weight-hanging text-indigo-300 text-xs"></i>
                   <p className="font-black text-lg sm:text-xl truncate">{stats.totalWeightKg.toFixed(3)} Kg</p>
                </div>
             </div>
             <div className="text-right overflow-hidden space-y-1">
                <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider opacity-80">Rate Applied</p>
                <p className="font-black text-lg sm:text-xl truncate">₹{parseFloat(priceValue) || 0}<span className="text-sm font-medium text-indigo-200">/{priceUnit}</span></p>
             </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleReset}
          disabled={isSaving}
          className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95 text-slate-700 dark:text-slate-200 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1 border-b-4 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-900 active:border-b-0"
        >
          <i className="fas fa-undo"></i> Reset
        </button>
        <button
          onClick={handleSave}
          disabled={!stats.isValid || isSaving}
          className={`flex-1 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl relative overflow-hidden text-sm sm:text-base order-1 sm:order-2 border-b-4 active:border-b-0 active:scale-95 active:translate-y-1 ${
            stats.isValid 
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-none border-emerald-800' 
            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed shadow-none border-slate-300 dark:border-slate-800'
          }`}
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="animate-pulse">Processing...</span>
            </>
          ) : showSuccess ? (
            <>
              <i className="fas fa-check scale-125 animate-in zoom-in duration-300"></i>
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <i className="fas fa-save"></i>
              <span>Save Record</span>
            </>
          )}
        </button>
      </div>

      {/* Calculation Breakdown */}
      {stats.isValid && (
        <div className={`bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 sm:p-6 border border-dashed border-slate-200 dark:border-slate-700 transition-opacity duration-500 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
           <h4 className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-4 text-center">Breakdown Logic</h4>
           <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between items-center gap-2">
                <span className="font-medium">Raw Weight</span>
                <span className="font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700">{weightValue} {weightUnit}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="font-medium">Standardized</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  {weightUnit === 'kg' ? `${weightValue}kg ➔ ${stats.totalWeightGrams}g` : `${weightValue}g ➔ ${stats.totalWeightKg.toFixed(3)}kg`}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-200 dark:border-slate-800 font-black text-indigo-600 dark:text-indigo-400 text-base">
                <span className="uppercase text-[10px] tracking-widest text-slate-400">Formula</span>
                <span className="font-mono tracking-tighter">
                  {priceUnit === 'kg' 
                    ? `(${stats.totalWeightKg.toFixed(3)}kg) × ₹${priceValue}` 
                    : `(${stats.totalWeightGrams}g) × ₹${priceValue}`}
                </span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
