import React from 'react';
import { Users } from 'lucide-react';
import type { UserInputState } from '../../domain/calculator/types';
import { NumberInput } from '../common/NumberInput';
import { HelpTooltip } from '../common/HelpTooltip';

interface FamilySectionProps {
  inputs: UserInputState;
  updateField: <K extends keyof UserInputState>(key: K, value: UserInputState[K]) => void;
  isSimpleMode?: boolean;
}

export const FamilySection: React.FC<FamilySectionProps> = ({
  inputs,
  updateField,
}) => {
  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 mb-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
          <Users size={18} />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            3. ご家族・扶養の状況
          </h2>
          <p className="text-xs text-slate-500">配偶者や養っているご家族について教えてください</p>
        </div>
      </div>

      {/* 1. 配偶者 */}
      <div className="mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800 flex items-center">
            配偶者はいますか？
            <HelpTooltip text="法律上の婚姻関係にある夫または妻がいて生計を一にしている場合「はい」を選んでください。" />
          </label>
          <div className="inline-flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => updateField('hasSpouse', true)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                inputs.hasSpouse
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              はい
            </button>
            <button
              type="button"
              onClick={() => updateField('hasSpouse', false)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                !inputs.hasSpouse
                  ? 'bg-slate-300 text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              いいえ
            </button>
          </div>
        </div>

        {inputs.hasSpouse && (
          <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3 animate-in fade-in duration-150">
            <NumberInput
              label="配偶者の給与年収（目安）"
              value={inputs.spouseIncome}
              onChange={(val) => updateField('spouseIncome', val)}
              hint="年収103万円以下なら満額控除"
              tooltip="パート・アルバイト等の給与収入です。年収103万円以下なら配偶者控除、103万超〜201万円未満なら配偶者特別控除の対象になります。"
              placeholder="0"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-slate-700">配偶者の年齢</span>
              <div className="inline-flex gap-2">
                <button
                  type="button"
                  onClick={() => updateField('spouseAge70OrOver', false)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                    !inputs.spouseAge70OrOver
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  69歳以下
                </button>
                <button
                  type="button"
                  onClick={() => updateField('spouseAge70OrOver', true)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                    inputs.spouseAge70OrOver
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  70歳以上（老人配偶者）
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 扶養家族 */}
      <div className="mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800 flex items-center">
            扶養家族はいますか？
            <HelpTooltip text="16歳以上で生計を一にして養っているご家族（高校生、大学生、70歳以上のご両親など）がいる場合「はい」を選んでください。※15歳以下（中学生以下）は児童手当の対象のため扶養控除の対象外です。" />
          </label>
          <div className="inline-flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                updateField('hasDependents', true);
                if (inputs.dependents16To18 === 0 && inputs.dependents19To22 === 0 && inputs.dependentsElderlyLiving === 0 && inputs.dependentsElderlySeparate === 0) {
                  updateField('dependents16To18', 1);
                }
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                inputs.hasDependents
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              はい
            </button>
            <button
              type="button"
              onClick={() => updateField('hasDependents', false)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                !inputs.hasDependents
                  ? 'bg-slate-300 text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              いいえ
            </button>
          </div>
        </div>

        {inputs.hasDependents && (
          <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3 animate-in fade-in duration-150">
            <p className="text-xs text-slate-500 mb-1">
              ※15歳以下（中学生以下）のお子様は扶養控除の対象外です
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">高校生年代 (16〜18歳)</span>
                  <span className="text-[11px] text-slate-400">控除38万円</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">人数</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('dependents16To18', Math.max(0, inputs.dependents16To18 - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{inputs.dependents16To18}</span>
                    <button
                      type="button"
                      onClick={() => updateField('dependents16To18', inputs.dependents16To18 + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-amber-900">大学生年代 (19〜22歳)</span>
                  <span className="text-[11px] text-amber-700 font-bold">控除63万円 (特定扶養)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-800">人数</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('dependents19To22', Math.max(0, inputs.dependents19To22 - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-amber-200 font-bold text-amber-800 hover:bg-amber-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{inputs.dependents19To22}</span>
                    <button
                      type="button"
                      onClick={() => updateField('dependents19To22', inputs.dependents19To22 + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-amber-200 font-bold text-amber-800 hover:bg-amber-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">70歳以上（同居老親）</span>
                  <span className="text-[11px] text-slate-400">控除58万円</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">人数</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('dependentsElderlyLiving', Math.max(0, inputs.dependentsElderlyLiving - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{inputs.dependentsElderlyLiving}</span>
                    <button
                      type="button"
                      onClick={() => updateField('dependentsElderlyLiving', inputs.dependentsElderlyLiving + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">70歳以上（別居・老人扶養）</span>
                  <span className="text-[11px] text-slate-400">控除48万円</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">人数</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('dependentsElderlySeparate', Math.max(0, inputs.dependentsElderlySeparate - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{inputs.dependentsElderlySeparate}</span>
                    <button
                      type="button"
                      onClick={() => updateField('dependentsElderlySeparate', inputs.dependentsElderlySeparate + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. 寡婦・ひとり親控除 */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800 flex items-center">
            寡婦、またはひとり親に該当しますか？
            <HelpTooltip text="配偶者と死別・離縁した後婚姻していない方で、一定の所得要件や生計を一にするお子様がいる場合が対象です。" />
          </label>
          <div className="inline-flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                if (inputs.singleParentType === 'none') {
                  updateField('singleParentType', 'single_parent');
                }
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                inputs.singleParentType !== 'none'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              はい
            </button>
            <button
              type="button"
              onClick={() => updateField('singleParentType', 'none')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                inputs.singleParentType === 'none'
                  ? 'bg-slate-300 text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              いいえ
            </button>
          </div>
        </div>

        {inputs.singleParentType !== 'none' && (
          <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/70 animate-in fade-in duration-150">
            <span className="text-xs font-semibold text-slate-700 block mb-2">該当する区分を選択</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateField('singleParentType', 'single_parent')}
                className={`py-2 px-3 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                  inputs.singleParentType === 'single_parent'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-500/10'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                ひとり親控除（控除35万円）
              </button>
              <button
                type="button"
                onClick={() => updateField('singleParentType', 'widow')}
                className={`py-2 px-3 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                  inputs.singleParentType === 'widow'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-500/10'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                寡婦控除（控除27万円）
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
