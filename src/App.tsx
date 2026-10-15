import { useState } from 'react';
import { Header } from './components/Header';
import { Toast } from './components/common/Toast';
import { SimpleModeSection } from './components/input/SimpleModeSection';
import { BusinessIncomeSection } from './components/input/BusinessIncomeSection';
import { SocialInsuranceSection } from './components/input/SocialInsuranceSection';
import { FamilySection } from './components/input/FamilySection';
import { OtherDeductionsSection } from './components/input/OtherDeductionsSection';
import { ResultSummaryCard } from './components/result/ResultSummaryCard';
import { FormulaBreakdown } from './components/result/FormulaBreakdown';
import { FloatingSummaryBar } from './components/result/FloatingSummaryBar';
import { useTaxCalculator } from './hooks/useTaxCalculator';

export function App() {
  const {
    inputs,
    updateField,
    resetInputs,
    saveInputs,
    isSimpleMode,
    setIsSimpleMode,
    result,
  } = useTaxCalculator();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2500);
  };

  const handleSave = () => {
    const success = saveInputs();
    if (success) {
      showToast('入力内容をブラウザに保存しました！');
    } else {
      showToast('保存に失敗しました');
    }
  };

  const handleReset = () => {
    resetInputs();
    showToast('入力内容とキャッシュをクリアしました');
  };

  const hasInputValues =
    inputs.easyTaxableIncome > 0 ||
    inputs.easyRevenue > 0 ||
    inputs.businessRevenue > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 sm:pb-16 relative">
      <Toast message={toastMessage} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Header
          isSimpleMode={isSimpleMode}
          onToggleMode={setIsSimpleMode}
          onReset={handleReset}
          onSave={handleSave}
          hasInputValues={hasInputValues}
        />

        <main className="mt-4">
          {/* かんたんモード: 確定申告書Bの課税所得1発、または売上・経費＋家族構成のたったこれだけ！ */}
          {isSimpleMode ? (
            <SimpleModeSection
              inputs={inputs}
              updateField={updateField}
              onSwitchToDetailed={() => setIsSimpleMode(false)}
            />
          ) : (
            /* 詳細モード: 確定申告書Bに沿って国保・年金・共済・扶養・住宅ローンまで徹底入力 */
            <>
              <BusinessIncomeSection
                inputs={inputs}
                updateField={updateField}
                isSimpleMode={false}
              />

              <SocialInsuranceSection
                inputs={inputs}
                updateField={updateField}
              />

              <FamilySection
                inputs={inputs}
                updateField={updateField}
                isSimpleMode={false}
              />

              <OtherDeductionsSection
                inputs={inputs}
                updateField={updateField}
                isSimpleMode={false}
              />
            </>
          )}

          {/* 試算結果カード */}
          <ResultSummaryCard result={result} />

          {/* 計算式のウラ側（ステップ別展開式） */}
          <FormulaBreakdown result={result} />
        </main>

        <footer className="text-center text-xs text-slate-400 space-y-1.5 py-6">
          <p>※ 本シミュレーションは令和8年現在の日本の税法および総務省のふるさと納税制度に準拠して試算しています。</p>
          <p>※ 実際の寄附上限額は自治体や個別の税額控除等により差異が生じる場合があります。目安としてご活用ください。</p>
        </footer>
      </div>

      <FloatingSummaryBar result={result} />
    </div>
  );
}

export default App;
