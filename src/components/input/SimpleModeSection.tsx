import React from 'react';
import { Zap, FileText } from 'lucide-react';
import type { UserInputState, EasyFamilyPreset } from '../../domain/calculator/types';
import { NumberInput } from '../common/NumberInput';

interface SimpleModeSectionProps {
  inputs: UserInputState;
  updateField: <K extends keyof UserInputState>(key: K, value: UserInputState[K]) => void;
  onSwitchToDetailed: () => void;
}

export const SimpleModeSection: React.FC<SimpleModeSectionProps> = ({
  inputs,
  updateField,
  onSwitchToDetailed,
}) => {
  const familyPresets: { preset: EasyFamilyPreset; label: string; desc: string }[] = [
    { preset: 'single', label: '独身・単身', desc: '配偶者・扶養なし' },
    { preset: 'married_no_child', label: '夫婦（子なし）', desc: '配偶者控除あり' },
    { preset: 'married_child_highschool', label: '夫婦 ＋ 高校生1人', desc: '配偶者 ＋ 16〜18歳' },
    { preset: 'married_child_college', label: '夫婦 ＋ 大学生1人', desc: '配偶者 ＋ 19〜22歳(特定)' },
  ];

  return (
    <div className="space-y-4 mb-6">
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-emerald-100 ring-2 ring-emerald-500/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Zap size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                かんたん30秒入力
              </h2>
              <p className="text-xs text-slate-500">数字を1〜2つ入れるだけで上限額をスピード試算！</p>
            </div>
          </div>

          <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => updateField('easyInputMethod', 'taxable_income')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                inputs.easyInputMethod === 'taxable_income'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              申告書の課税所得
            </button>
            <button
              type="button"
              onClick={() => updateField('easyInputMethod', 'revenue_expenses')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                inputs.easyInputMethod === 'revenue_expenses'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              売上と経費
            </button>
          </div>
        </div>

        {inputs.easyInputMethod === 'taxable_income' ? (
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed flex items-start gap-2">
              <FileText size={16} className="text-emerald-700 shrink-0 mt-0.5" />
              <span>
                昨年の確定申告書Bがお手元にある方は、第一表の<strong>「課税される所得金額（㉚番）」</strong>を入れるだけで一発で計算できます！
              </span>
            </div>

            <NumberInput
              label="確定申告書の「課税される所得金額」"
              value={inputs.easyTaxableIncome}
              onChange={(val) => updateField('easyTaxableIncome', val)}
              placeholder="例: 3,500,000"
              hint="確定申告書B ㉚番の数字"
              tooltip="確定申告書B 第一表の右下にある「課税される所得金額 ㉚」の金額をそのまま入力してください。"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <NumberInput
              label="年間の売上（事業収入）"
              value={inputs.easyRevenue}
              onChange={(val) => updateField('easyRevenue', val)}
              placeholder="例: 8,000,000"
              tooltip="1年間の売上の概算合計額です。"
            />

            <NumberInput
              label="年間の必要経費"
              value={inputs.easyExpenses}
              onChange={(val) => updateField('easyExpenses', val)}
              placeholder="例: 3,000,000"
              tooltip="仕入れや家賃、経費の概算合計額です。"
            />

            <div className="pt-2">
              <label className="text-sm font-semibold text-slate-800 block mb-2">
                家族構成を選択
              </label>
              <div className="grid grid-cols-2 gap-2">
                {familyPresets.map((opt) => {
                  const isSelected = inputs.easyFamilyPreset === opt.preset;
                  return (
                    <button
                      key={opt.preset}
                      type="button"
                      onClick={() => updateField('easyFamilyPreset', opt.preset)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-500/10'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-sm">{opt.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            国保やiDeCo、住宅ローン等も含めて正確に計算したい？
          </span>
          <button
            type="button"
            onClick={onSwitchToDetailed}
            className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
          >
            詳細モードに切り替える →
          </button>
        </div>
      </div>
    </div>
  );
};
