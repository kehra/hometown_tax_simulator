import { ArrowUp } from 'lucide-react';
import type React from 'react';
import type { TaxCalculationResult } from '../../domain/calculator/types';

interface FloatingSummaryBarProps {
  result: TaxCalculationResult;
}

export const FloatingSummaryBar: React.FC<FloatingSummaryBarProps> = ({ result }) => {
  const scrollToResult = () => {
    const el = document.getElementById('sim-result');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 shadow-lg sm:hidden">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-500 block">寄附上限の目安</span>
          <span className="text-xl font-extrabold text-emerald-700 tracking-tight">
            約 {result.hometownTaxLimit.toLocaleString('ja-JP')}{' '}
            <span className="text-xs font-normal text-slate-600">円</span>
          </span>
        </div>

        <button
          type="button"
          onClick={scrollToResult}
          className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
        >
          <span>結果を見る</span>
          <ArrowUp size={14} />
        </button>
      </div>
    </div>
  );
};
