import { calcBusinessIncome } from './businessIncome';
import { calcDeductions } from './deductions';
import type { CalculationStep, TaxCalculationResult, UserInputState } from './types';

export function getIncomeTaxBracket(taxableIncome: number): { rate: number; deduction: number } {
  if (taxableIncome <= 0) return { rate: 0, deduction: 0 };
  if (taxableIncome <= 1_949_000) return { rate: 0.05, deduction: 0 };
  if (taxableIncome <= 3_299_000) return { rate: 0.10, deduction: 97_500 };
  if (taxableIncome <= 6_949_000) return { rate: 0.20, deduction: 427_500 };
  if (taxableIncome <= 8_999_000) return { rate: 0.23, deduction: 636_000 };
  if (taxableIncome <= 17_999_000) return { rate: 0.33, deduction: 1_536_000 };
  if (taxableIncome <= 39_999_000) return { rate: 0.40, deduction: 2_796_000 };
  return { rate: 0.45, deduction: 4_796_000 };
}

function formatYen(amount: number): string {
  return `${Math.round(amount).toLocaleString('ja-JP')}円`;
}

/**
 * かんたんモード（確定申告書の課税所得から直接試算するモード）
 */
function calculateHometownTaxFromTaxableIncome(taxableIncomeInput: number): TaxCalculationResult {
  const taxableIncome = Math.floor(Math.max(0, taxableIncomeInput) / 1_000) * 1_000;
  const taxableIncomeResidentTax = taxableIncome;

  const { rate: marginalRate } = getIncomeTaxBracket(taxableIncome);
  const effectiveIncomeTaxRate = marginalRate * 1.021;

  // 住民税所得割額（10% - 調整控除2,500円概算）
  const standardResidentTax = Math.floor(taxableIncomeResidentTax * 0.10);
  const residentTaxIncomePercent = Math.max(0, standardResidentTax - (taxableIncome > 0 ? 2_500 : 0));

  let hometownTaxLimit = 0;
  const denominator = 0.90 - effectiveIncomeTaxRate;

  if (residentTaxIncomePercent > 0 && denominator > 0) {
    const specialDeductionLimit = residentTaxIncomePercent * 0.20;
    const baseLimit = specialDeductionLimit / denominator;
    hometownTaxLimit = Math.floor(baseLimit + 2_000);
  }

  const steps: CalculationStep[] = [
    {
      stepNumber: 1,
      title: '確定申告書の課税所得金額',
      badge: 'Step 1',
      description: '確定申告書Bの「課税される所得金額」（第1表 ㉚番）を使用します。',
      formula: '確定申告書の課税所得（千円未満切捨）',
      formulaWithValues: `${formatYen(taxableIncome)}`,
      resultFormatted: formatYen(taxableIncome),
    },
    {
      stepNumber: 2,
      title: '所得税率の判定',
      badge: 'Step 2',
      description: '課税所得に応じた所得税の限界税率（復興特別所得税1.021を含む）を判定します。',
      formula: '所得税率判定 (5%〜45%) × 1.021',
      formulaWithValues: `所得税率 ${(marginalRate * 100).toFixed(0)}% × 1.021 ＝ ${(effectiveIncomeTaxRate * 100).toFixed(2)}%`,
      resultFormatted: `${(marginalRate * 100).toFixed(0)}% (実効 ${(effectiveIncomeTaxRate * 100).toFixed(2)}%)`,
    },
    {
      stepNumber: 3,
      title: '住民税所得割額の計算',
      badge: 'Step 3',
      description: '課税所得に住民税率10%を掛け、調整控除（2,500円）を差し引きます。',
      formula: '(課税所得 × 10%) − 調整控除(2,500円)',
      formulaWithValues: `(${formatYen(taxableIncome)} × 10%) − 2,500円 ＝ ${formatYen(residentTaxIncomePercent)}`,
      resultFormatted: formatYen(residentTaxIncomePercent),
    },
    {
      stepNumber: 4,
      title: 'ふるさと納税限度額の公式代入',
      badge: 'Step 4',
      description: '自己負担2,000円を除いた全額が控除される特例控除限度額（住民税所得割額の20%）から逆算した法定算式に代入します。',
      formula: '上限額 = (住民税所得割額 × 20%) ÷ (90% − 実効所得税率) ＋ 2,000円',
      formulaWithValues: residentTaxIncomePercent > 0
        ? `(${formatYen(residentTaxIncomePercent)} × 20%) ÷ (90% − ${(effectiveIncomeTaxRate * 100).toFixed(2)}%) ＋ 2,000円
＝ ${formatYen(Math.floor(residentTaxIncomePercent * 0.2))} ÷ ${(denominator).toFixed(4)} ＋ 2,000円
＝ ${formatYen(hometownTaxLimit)}`
        : '課税所得が0円または非課税水準のため、寄附上限額は0円となります。',
      resultFormatted: formatYen(hometownTaxLimit),
    },
  ];

  return {
    businessIncome: taxableIncome,
    totalIncome: taxableIncome,
    totalDeductionsIncomeTax: 0,
    totalDeductionsResidentTax: 0,
    taxableIncome,
    taxableIncomeResidentTax,
    marginalIncomeTaxRate: marginalRate,
    effectiveIncomeTaxRate,
    residentTaxIncomePercent,
    adjustmentDeduction: 2_500,
    hometownTaxLimit,
    steps,
  };
}

export function calculateHometownTax(input: UserInputState, isSimpleMode: boolean = false): TaxCalculationResult {
  // かんたんモードで「課税所得入力」を選んでいる場合
  if (isSimpleMode && input.easyInputMethod === 'taxable_income') {
    return calculateHometownTaxFromTaxableIncome(input.easyTaxableIncome);
  }

  // かんたんモードで「売上・経費＋家族プリセット」を選んでいる場合
  let effectiveInput = { ...input };
  if (isSimpleMode && input.easyInputMethod === 'revenue_expenses') {
    effectiveInput.businessRevenue = input.easyRevenue;
    effectiveInput.businessExpenses = input.easyExpenses;
    effectiveInput.blueDeduction = '650k'; // かんたんモードでは最も一般的な65万控除をデフォルト適用
    
    // 家族構成プリセットの適用
    effectiveInput.hasSpouse = input.easyFamilyPreset !== 'single';
    effectiveInput.spouseIncome = 0; // 配偶者控除満額
    effectiveInput.hasDependents = input.easyFamilyPreset === 'married_child_highschool' || input.easyFamilyPreset === 'married_child_college';
    effectiveInput.dependents16To18 = input.easyFamilyPreset === 'married_child_highschool' ? 1 : 0;
    effectiveInput.dependents19To22 = input.easyFamilyPreset === 'married_child_college' ? 1 : 0;
    
    // 国保・年金の概算（売上-経費の粗利から一般的な約10%〜12%を自動推定）
    const roughProfit = Math.max(0, input.easyRevenue - input.easyExpenses - 650_000);
    effectiveInput.socialInsurance = Math.min(1_000_000, Math.max(200_000, Math.floor(roughProfit * 0.12)));
    effectiveInput.mutualAidInsurance = 0;
  }

  // 詳細モードの計算
  const business = calcBusinessIncome(
    effectiveInput.businessRevenue,
    effectiveInput.businessExpenses,
    effectiveInput.blueDeduction,
    effectiveInput.familySalary
  );
  const otherIncome = Math.max(0, effectiveInput.otherIncome || 0);
  const totalIncome = business.businessIncome + otherIncome;

  const deductions = calcDeductions(effectiveInput, totalIncome);

  const rawTaxableIncome = Math.max(0, totalIncome - deductions.incomeTaxDeductions);
  const taxableIncome = Math.floor(rawTaxableIncome / 1_000) * 1_000;

  const rawTaxableResidentTax = Math.max(0, totalIncome - deductions.residentTaxDeductions);
  const taxableIncomeResidentTax = Math.floor(rawTaxableResidentTax / 1_000) * 1_000;

  const { rate: marginalRate } = getIncomeTaxBracket(taxableIncome);
  const effectiveIncomeTaxRate = marginalRate * 1.021;

  const standardResidentTax = Math.floor(taxableIncomeResidentTax * 0.10);
  
  // 住宅ローン控除（所得税から引ききれなかった分を住民税所得割額から控除）
  const incomeTaxBracket = getIncomeTaxBracket(taxableIncome);
  const incomeTaxBeforeCredit = Math.max(0, Math.floor(taxableIncome * incomeTaxBracket.rate - incomeTaxBracket.deduction));
  const rawMortgage = Math.max(0, effectiveInput.mortgageDeduction || 0);
  const excessMortgage = Math.max(0, rawMortgage - incomeTaxBeforeCredit);
  // 住民税からの住宅ローン控除限度額（前年課税所得の5%または最高97,500円）
  const residentTaxMortgageCap = Math.min(97_500, Math.floor(taxableIncome * 0.05));
  const residentTaxMortgageDeduction = Math.min(excessMortgage, residentTaxMortgageCap);

  // 住民税所得割額 ＝ 住民税課税所得 × 10% − 調整控除 − 住民税住宅ローン控除
  const residentTaxIncomePercent = Math.max(
    0,
    standardResidentTax - deductions.adjustmentDeduction - residentTaxMortgageDeduction
  );

  let hometownTaxLimit = 0;
  const denominator = 0.90 - effectiveIncomeTaxRate;

  if (residentTaxIncomePercent > 0 && denominator > 0) {
    const specialDeductionLimit = residentTaxIncomePercent * 0.20;
    const baseLimit = specialDeductionLimit / denominator;
    hometownTaxLimit = Math.floor(baseLimit + 2_000);

    const maxDonationCap = Math.floor(totalIncome * 0.30);
    if (maxDonationCap > 0 && hometownTaxLimit > maxDonationCap) {
      hometownTaxLimit = maxDonationCap;
    }
  }

  const steps: CalculationStep[] = [
    {
      stepNumber: 1,
      title: '事業所得の計算',
      badge: 'Step 1',
      description: '売上から仕入れ・経費・専従者給与、そして青色申告の特別控除を差し引いて、事業の純粋な所得を計算します。',
      formula: '売上 − 必要経費 − 専従者給与 − 青色申告特別控除 = 事業所得',
      formulaWithValues: `${formatYen(effectiveInput.businessRevenue)} − ${formatYen(effectiveInput.businessExpenses)} − ${formatYen(effectiveInput.familySalary)} − ${formatYen(business.actualBlueDeduction)} = ${formatYen(business.businessIncome)}`,
      resultFormatted: formatYen(business.businessIncome),
    },
    {
      stepNumber: 2,
      title: '所得控除の合計',
      badge: 'Step 2',
      description: '生活環境や支払いに応じて税金を安くできる「控除」をまとめます。所得税と住民税で基礎控除などの金額が異なります。',
      formula: '基礎控除 ＋ 社会保険料 ＋ 小規模企業共済等 ＋ 家族・扶養・各種控除 = 控除合計',
      formulaWithValues: `所得税用: 基礎控除(${formatYen(deductions.basicDeductionIncomeTax)}) + 社保(${formatYen(deductions.socialInsuranceDeduction)}) + その他 = ${formatYen(deductions.incomeTaxDeductions)}
住民税用: 基礎控除(${formatYen(deductions.basicDeductionResidentTax)}) + 社保(${formatYen(deductions.socialInsuranceDeduction)}) + その他 = ${formatYen(deductions.residentTaxDeductions)}`,
      resultFormatted: `所得税用: ${formatYen(deductions.incomeTaxDeductions)} / 住民税用: ${formatYen(deductions.residentTaxDeductions)}`,
    },
    {
      stepNumber: 3,
      title: '課税所得金額（税金がかかる金額）',
      badge: 'Step 3',
      description: '所得から控除合計を引いた金額です。税法の規定により、千円未満は切り捨てられます。',
      formula: '事業所得（＋他所得） − 所得控除合計（千円未満切捨） = 課税所得金額',
      formulaWithValues: `所得税課税所得: ${formatYen(totalIncome)} − ${formatYen(deductions.incomeTaxDeductions)} ＝ ${formatYen(taxableIncome)}
住民税課税所得: ${formatYen(totalIncome)} − ${formatYen(deductions.residentTaxDeductions)} ＝ ${formatYen(taxableIncomeResidentTax)}`,
      resultFormatted: `所得税: ${formatYen(taxableIncome)} / 住民税: ${formatYen(taxableIncomeResidentTax)}`,
    },
    {
      stepNumber: 4,
      title: '所得税率と住民税所得割額',
      badge: 'Step 4',
      description: '課税所得に応じた所得税の限界税率（復興特別所得税1.021を含む）と、住民税（10%から調整控除を引いた所得割額）を計算します。',
      formula: '所得税率判定 / 住民税所得割額 = (住民税課税所得 × 10%) − 調整控除',
      formulaWithValues: `所得税率: ${(marginalRate * 100).toFixed(0)}% (復興税込み: ${(effectiveIncomeTaxRate * 100).toFixed(2)}%)
住民税所得割額: (${formatYen(taxableIncomeResidentTax)} × 10%) − ${formatYen(deductions.adjustmentDeduction)} ＝ ${formatYen(residentTaxIncomePercent)}`,
      resultFormatted: `税率: ${(marginalRate * 100).toFixed(0)}% / 住民税所得割: ${formatYen(residentTaxIncomePercent)}`,
    },
    {
      stepNumber: 5,
      title: 'ふるさと納税限度額の公式代入',
      badge: 'Step 5',
      description: '自己負担2,000円を除いた全額が控除される上限額（特例控除限度額 = 住民税所得割額の20%）を導き出す法定算式に、あなたの数値を代入します。',
      formula: '上限額 = (住民税所得割額 × 20%) ÷ (90% − 実効所得税率) ＋ 2,000円',
      formulaWithValues: residentTaxIncomePercent > 0
        ? `分子: 住民税所得割額(${formatYen(residentTaxIncomePercent)}) × 20% ＝ ${formatYen(Math.floor(residentTaxIncomePercent * 0.2))}
分母: 90% − 実効所得税率(${(effectiveIncomeTaxRate * 100).toFixed(2)}%) ＝ ${(denominator * 100).toFixed(2)}% (${(denominator).toFixed(4)})
上限額: ${formatYen(Math.floor(residentTaxIncomePercent * 0.2))} ÷ ${(denominator).toFixed(4)} ＋ 2,000円 ＝ ${formatYen(hometownTaxLimit)}`
        : '住民税所得割額が0円のため、本年度の寄附上限額は0円（非課税）となります。',
      resultFormatted: formatYen(hometownTaxLimit),
    },
  ];

  return {
    businessIncome: business.businessIncome,
    totalIncome,
    totalDeductionsIncomeTax: deductions.incomeTaxDeductions,
    totalDeductionsResidentTax: deductions.residentTaxDeductions,
    taxableIncome,
    taxableIncomeResidentTax,
    marginalIncomeTaxRate: marginalRate,
    effectiveIncomeTaxRate,
    residentTaxIncomePercent,
    adjustmentDeduction: deductions.adjustmentDeduction,
    hometownTaxLimit,
    steps,
  };
}
