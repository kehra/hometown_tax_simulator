import { Award, Check, Copy } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import type { TaxCalculationResult } from '../../domain/calculator/types';

interface ResultSummaryCardProps {
  result: TaxCalculationResult;
}

export const ResultSummaryCard: React.FC<ResultSummaryCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = [
      '【個人事業主 ふるさと納税シミュレーション結果】',
      `寄附上限額の目安: 約 ${result.hometownTaxLimit.toLocaleString('ja-JP')} 円`,
      '実質自己負担額: 2,000 円',
      `事業所得: ${result.businessIncome.toLocaleString('ja-JP')} 円`,
      `課税所得（所得税）: ${result.taxableIncome.toLocaleString('ja-JP')} 円`,
      `住民税所得割額: ${result.residentTaxIncomePercent.toLocaleString('ja-JP')} 円`,
      `適用所得税率: ${(result.marginalIncomeTaxRate * 100).toFixed(0)}%`,
      '※このシミュレーション結果は概算目安です。',
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isZero = result.hometownTaxLimit === 0;

  return (
    <div
      id="sim-result"
      className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-900/10 mb-6 relative overflow-hidden"
    >
      <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
          <Award size={14} className="text-amber-300" />
          <span>シミュレーション結果</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium backdrop-blur-xs transition-colors cursor-pointer"
        >
          {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
          <span>{copied ? 'コピー完了！' : '結果をコピー'}</span>
        </button>
      </div>

      <div className="text-center my-4">
        <p className="text-xs sm:text-sm text-emerald-100 font-medium mb-1">
          自己負担2,000円で寄附できる上限額の目安
        </p>
        <div className="text-3xl sm:text-5xl font-black tracking-tight text-white flex items-baseline justify-center gap-1">
          <span className="text-lg sm:text-2xl font-bold text-emerald-200">約</span>
          <span className="font-extrabold">{result.hometownTaxLimit.toLocaleString('ja-JP')}</span>
          <span className="text-lg sm:text-2xl font-bold text-emerald-200">円</span>
        </div>
        <p className="text-xs text-emerald-100/90 mt-2">
          {isZero
            ? '所得税・住民税が非課税水準のため、自己負担2,000円での控除枠はありません'
            : 'この金額まで寄附しても、実質2,000円の負担で返礼品を受け取れます！'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/15 text-center text-xs">
        <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
          <span className="block text-emerald-200 text-[11px] mb-0.5">事業所得</span>
          <span className="font-bold text-sm sm:text-base">
            {result.businessIncome.toLocaleString('ja-JP')}円
          </span>
        </div>
        <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
          <span className="block text-emerald-200 text-[11px] mb-0.5">所得税率</span>
          <span className="font-bold text-sm sm:text-base">
            {(result.marginalIncomeTaxRate * 100).toFixed(0)}%
          </span>
        </div>
        <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-xs">
          <span className="block text-emerald-200 text-[11px] mb-0.5">住民税所得割額</span>
          <span className="font-bold text-sm sm:text-base">
            {result.residentTaxIncomePercent.toLocaleString('ja-JP')}円
          </span>
        </div>
      </div>
    </div>
  );
};
