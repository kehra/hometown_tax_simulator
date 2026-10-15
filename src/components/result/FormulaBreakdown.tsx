import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, CheckCircle2 } from 'lucide-react';
import type { TaxCalculationResult } from '../../domain/calculator/types';

interface FormulaBreakdownProps {
  result: TaxCalculationResult;
}

export const FormulaBreakdown: React.FC<FormulaBreakdownProps> = ({ result }) => {
  const [openStep, setOpenStep] = useState<number | null>(null);

  const toggleStep = (stepNumber: number) => {
    setOpenStep(openStep === stepNumber ? null : stepNumber);
  };

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 mb-8">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
          <Calculator size={18} />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            どうやって計算したの？（計算式のウラ側）
          </h2>
          <p className="text-xs text-slate-500">あなたの入力値を代入したステップ順の計算プロセスです</p>
        </div>
      </div>

      <div className="space-y-3">
        {result.steps.map((step) => {
          const isOpen = openStep === step.stepNumber;
          return (
            <div
              key={step.stepNumber}
              className={`border rounded-2xl transition-all ${
                isOpen ? 'border-teal-400 bg-teal-50/20 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleStep(step.stepNumber)}
                className="w-full flex items-start justify-between p-4 text-left cursor-pointer group"
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-2">
                  <span className="shrink-0 px-2 py-0.5 rounded-lg bg-teal-100 text-teal-800 font-extrabold text-xs mt-0.5">
                    {step.badge}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm sm:text-base text-slate-800 leading-snug group-hover:text-teal-800 transition-colors">
                      {step.title}
                    </div>
                    {/* 2段目: 算出された金額・結果をタイトルの下に余裕を持って配置 */}
                    <div className="text-xs font-semibold text-teal-700 mt-1 break-words">
                      👉 {step.resultFormatted}
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 shrink-0 mt-1 p-1 rounded-lg group-hover:bg-teal-50 transition-colors">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-teal-100/60 animate-in fade-in duration-150">
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs leading-relaxed space-y-2">
                    <div>
                      <span className="text-slate-400 text-[10px] block font-sans">【基本公式】</span>
                      <code className="text-emerald-400 block whitespace-pre-wrap">{step.formula}</code>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-slate-400 text-[10px] block font-sans">【あなたの数値を代入】</span>
                      <code className="text-amber-300 block whitespace-pre-wrap font-semibold leading-relaxed">
                        {step.formulaWithValues}
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>所得税と住民税の内訳比較</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400">
                <th className="py-2 font-medium">項目</th>
                <th className="py-2 text-right font-medium">所得税用</th>
                <th className="py-2 text-right font-medium">住民税用</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2 font-medium">所得控除の合計</td>
                <td className="py-2 text-right font-semibold">{result.totalDeductionsIncomeTax.toLocaleString()} 円</td>
                <td className="py-2 text-right font-semibold">{result.totalDeductionsResidentTax.toLocaleString()} 円</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">課税所得金額（千円未満切捨）</td>
                <td className="py-2 text-right font-semibold">{result.taxableIncome.toLocaleString()} 円</td>
                <td className="py-2 text-right font-semibold">{result.taxableIncomeResidentTax.toLocaleString()} 円</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">適用税率</td>
                <td className="py-2 text-right font-semibold">{(result.marginalIncomeTaxRate * 100).toFixed(0)}% (実効 {(result.effectiveIncomeTaxRate * 100).toFixed(2)}%)</td>
                <td className="py-2 text-right font-semibold">10% (調整控除前)</td>
              </tr>
              <tr className="bg-emerald-50/50 font-bold text-slate-900">
                <td className="py-2.5 text-emerald-900">住民税 所得割額（特例控除の基準）</td>
                <td className="py-2.5 text-right text-slate-400 font-normal">-</td>
                <td className="py-2.5 text-right text-emerald-800">{result.residentTaxIncomePercent.toLocaleString()} 円</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
