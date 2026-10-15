import { Briefcase, TrendingUp } from 'lucide-react';
import type React from 'react';
import { calcBusinessIncome } from '../../domain/calculator/businessIncome';
import type { BlueDeductionType, UserInputState } from '../../domain/calculator/types';
import { NumberInput } from '../common/NumberInput';

interface BusinessIncomeSectionProps {
  inputs: UserInputState;
  updateField: <K extends keyof UserInputState>(key: K, value: UserInputState[K]) => void;
  isSimpleMode: boolean;
}

export const BusinessIncomeSection: React.FC<BusinessIncomeSectionProps> = ({
  inputs,
  updateField,
  isSimpleMode,
}) => {
  const { profitBeforeBlue, actualBlueDeduction, businessIncome } = calcBusinessIncome(
    inputs.businessRevenue,
    inputs.businessExpenses,
    inputs.blueDeduction,
    inputs.familySalary,
  );

  const blueOptions: { type: BlueDeductionType; label: string; desc: string }[] = [
    { type: '650k', label: '青色 65万円控除', desc: '複式簿記 ＋ e-Tax電子申告' },
    { type: '550k', label: '青色 55万円控除', desc: '複式簿記（紙提出など）' },
    { type: '100k', label: '青色 10万円控除', desc: '単式・簡易簿記' },
    { type: 'none', label: '白色申告（0円）', desc: '特別控除なし' },
  ];

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 mb-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
          <Briefcase size={18} />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">1. 事業の収入と経費</h2>
          <p className="text-xs text-slate-500">1年間の売上と経費を入力してください</p>
        </div>
      </div>

      <div className="space-y-1">
        <NumberInput
          label="事業収入（年間売上）"
          value={inputs.businessRevenue}
          onChange={(val) => updateField('businessRevenue', val)}
          hint="税込売上"
          tooltip="1年間の売上の総額です。本業での入金合計額を入力してください。"
          placeholder="例: 8,000,000"
        />

        <NumberInput
          label="事業の必要経費"
          value={inputs.businessExpenses}
          onChange={(val) => updateField('businessExpenses', val)}
          hint="売上原価を含む"
          tooltip="仕入れ、外注費、家賃、通信費、旅費交通費、消耗品費などの経費合計額です。"
          placeholder="例: 3,000,000"
        />

        {(!isSimpleMode || inputs.familySalary > 0) && (
          <NumberInput
            label="専従者給与（家族への給与）"
            value={inputs.familySalary}
            onChange={(val) => updateField('familySalary', val)}
            hint="該当者のみ"
            tooltip="青色事業専従者として生計を一にする配偶者や親族に支払った給与の年間合計額です。"
            placeholder="0"
          />
        )}
      </div>

      {/* 青色申告特別控除の選択 */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <span className="text-sm font-semibold text-slate-800 block mb-2">青色申告特別控除</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {blueOptions.map((opt) => {
            const isSelected = inputs.blueDeduction === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => updateField('blueDeduction', opt.type)}
                className={`flex items-start text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 mr-2.5 flex items-center justify-center border transition-all ${
                    isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="text-sm font-bold">{opt.label}</div>
                  <div className="text-xs text-slate-500">{opt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 事業所得のリアルタイム表示 */}
      <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
        <span className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-1.5">
          <TrendingUp size={16} className="text-emerald-600" />
          <span>事業所得（目安）:</span>
        </span>
        <span className="text-base sm:text-lg font-extrabold text-slate-900">
          {businessIncome.toLocaleString('ja-JP')}
          <span className="text-xs font-normal text-slate-500 ml-1">円</span>
        </span>
      </div>
      {profitBeforeBlue < actualBlueDeduction && (
        <p className="text-[11px] text-amber-600 mt-1.5 ml-1">
          ※青色申告控除は利益（{profitBeforeBlue.toLocaleString()}円）が上限となります。
        </p>
      )}
    </section>
  );
};
