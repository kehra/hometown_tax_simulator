import { ShieldCheck } from 'lucide-react';
import type React from 'react';
import type { UserInputState } from '../../domain/calculator/types';
import { NumberInput } from '../common/NumberInput';

interface SocialInsuranceSectionProps {
  inputs: UserInputState;
  updateField: <K extends keyof UserInputState>(key: K, value: UserInputState[K]) => void;
}

export const SocialInsuranceSection: React.FC<SocialInsuranceSectionProps> = ({
  inputs,
  updateField,
}) => {
  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 mb-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
          <ShieldCheck size={18} />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">2. 社会保険・共済・年金</h2>
          <p className="text-xs text-slate-500">個人事業主の節税効果がとても高い重要控除です</p>
        </div>
      </div>

      <div className="space-y-1">
        <NumberInput
          label="国民健康保険料 ＋ 国民年金保険料"
          value={inputs.socialInsurance}
          onChange={(val) => updateField('socialInsurance', val)}
          hint="支払った全額が控除対象"
          tooltip="1年間に支払った国民健康保険料（税）と国民年金保険料、介護保険料などの合計です。同生計の家族の分を支払っている場合も含められます。"
          placeholder="例: 800,000"
        />

        <NumberInput
          label="小規模企業共済・iDeCo等の掛金"
          value={inputs.mutualAidInsurance}
          onChange={(val) => updateField('mutualAidInsurance', val)}
          hint="小規模企業共済等掛金控除"
          tooltip="小規模企業共済の掛金、iDeCo（個人型確定拠出年金）の掛金の年間合計額です。こちらも全額が所得から控除されます。"
          placeholder="例: 240,000 (月2万円なら24万)"
        />
      </div>
    </section>
  );
};
