import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import type { UserInputState } from '../../domain/calculator/types';
import { NumberInput } from '../common/NumberInput';

interface OtherDeductionsSectionProps {
  inputs: UserInputState;
  updateField: <K extends keyof UserInputState>(key: K, value: UserInputState[K]) => void;
  isSimpleMode?: boolean;
}

export const OtherDeductionsSection: React.FC<OtherDeductionsSectionProps> = ({
  inputs,
  updateField,
  isSimpleMode = false,
}) => {
  const [isOpen, setIsOpen] = useState(!isSimpleMode);

  const hasAnyValues =
    inputs.lifeInsurancePremium > 0 ||
    inputs.earthquakeInsurancePremium > 0 ||
    inputs.medicalExpenses > 0 ||
    inputs.mortgageDeduction > 0 ||
    inputs.otherIncome > 0;

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 mb-5">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <FileText size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                4. その他の控除 ＆ その他所得
              </h2>
              {hasAnyValues && (
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                  入力あり
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">確定申告書Bの各控除欄の数字をそのまま入力できます</p>
          </div>
        </div>

        <div className="p-1.5 rounded-xl bg-slate-50 text-slate-400 group-hover:text-slate-600 transition-colors">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 animate-in fade-in duration-150">
          <NumberInput
            label="生命保険料控除"
            value={inputs.lifeInsurancePremium}
            onChange={(val) => updateField('lifeInsurancePremium', val)}
            hint="確定申告書B ⑮番（上限12万円）"
            tooltip="確定申告書B 第一表 ⑮番「生命保険料控除」の金額です。支払った保険料ではなく、計算後の控除額（最大12万円）を入力してください。"
            placeholder="0"
          />

          <NumberInput
            label="地震保険料控除"
            value={inputs.earthquakeInsurancePremium}
            onChange={(val) => updateField('earthquakeInsurancePremium', val)}
            hint="確定申告書B ⑯番（上限5万円）"
            tooltip="確定申告書B 第一表 ⑯番「地震保険料控除」の金額です。支払額ではなく、計算後の控除額（最大5万円）を入力してください。"
            placeholder="0"
          />

          <NumberInput
            label="医療費控除"
            value={inputs.medicalExpenses}
            onChange={(val) => updateField('medicalExpenses', val)}
            hint="確定申告書B ⑰番（上限200万円）"
            tooltip="確定申告書B 第一表 ⑰番「医療費控除」の金額です。支払った医療費総額から10万円等を引いた後の、確定申告書上の控除額を入力してください。"
            placeholder="0"
          />

          <NumberInput
            label="住宅借入金等特別控除（住宅ローン控除）"
            value={inputs.mortgageDeduction}
            onChange={(val) => updateField('mortgageDeduction', val)}
            hint="確定申告書B ㊶番"
            tooltip="確定申告書B 第一表 ㊶番「住宅借入金等特別控除」の金額です。住宅ローン控除がある場合、住民税所得割額が減額され、ふるさと納税上限額に影響する場合があります。"
            placeholder="0"
          />

          <NumberInput
            label="その他の所得（株式・FX・不動産・暗号資産等）"
            value={inputs.otherIncome}
            onChange={(val) => updateField('otherIncome', val)}
            hint="申告する他所得の利益合算"
            tooltip="確定申告を行う株式譲渡益、配当、FX利益、暗号資産の売却益、不動産所得などの所得金額（経費を引いた利益）です。所得が増えるとふるさと納税の上限額も上がります。"
            placeholder="0"
          />
        </div>
      )}
    </section>
  );
};
