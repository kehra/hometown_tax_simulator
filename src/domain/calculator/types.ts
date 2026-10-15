export type BlueDeductionType = 'none' | '100k' | '550k' | '650k';

export type SingleParentType = 'none' | 'widow' | 'single_parent';

export type EasyInputMethod = 'taxable_income' | 'revenue_expenses';
export type EasyFamilyPreset =
  | 'single'
  | 'married_no_child'
  | 'married_child_highschool'
  | 'married_child_college';

export interface UserInputState {
  // --- かんたんモード用 ---
  easyInputMethod: EasyInputMethod;
  easyTaxableIncome: number; // 確定申告書Bの「課税される所得金額」
  easyRevenue: number; // 年間売上
  easyExpenses: number; // 年間経費
  easyFamilyPreset: EasyFamilyPreset; // 家族構成ワンタップ

  // --- 詳細モード用 ---
  businessRevenue: number; // 事業収入（売上）
  businessExpenses: number; // 必要経費（売上原価含む）
  blueDeduction: BlueDeductionType; // 青色申告特別控除
  familySalary: number; // 専従者給与

  socialInsurance: number; // 国民健康保険・国民年金
  mutualAidInsurance: number; // 小規模企業共済・iDeCo

  hasSpouse: boolean; // 配偶者の有無
  hasDependents: boolean; // 扶養家族の有無
  spouseIncome: number; // 配偶者の給与年収
  spouseAge70OrOver: boolean; // 配偶者が70歳以上か

  dependents16To18: number; // 一般扶養親族 (16〜18歳)
  dependents19To22: number; // 特定扶養親族 (19〜22歳)
  dependentsGeneral: number; // 一般扶養親族 (23〜69歳)
  dependentsElderlyLiving: number; // 老人扶養親族 (70歳以上同居)
  dependentsElderlySeparate: number; // 老人扶養親族 (70歳以上別居)

  singleParentType: SingleParentType; // 寡婦・ひとり親控除
  generalDisabledCount: number; // 一般障害者
  specialDisabledCount: number; // 特別障害者（別居・本人）
  livingSpecialDisabledCount: number; // 同居特別障害者

  lifeInsurancePremium: number; // 生命保険料の支払額
  earthquakeInsurancePremium: number; // 地震保険料の支払額
  medicalExpenses: number; // 支払った医療費
  mortgageDeduction: number; // 住宅借入金等特別控除額（住宅ローン控除）

  otherIncome: number; // 株式・FX・不動産・仮想通貨等のその他所得合計
}

export const DEFAULT_USER_INPUT: UserInputState = {
  easyInputMethod: 'taxable_income',
  easyTaxableIncome: 0,
  easyRevenue: 0,
  easyExpenses: 0,
  easyFamilyPreset: 'single',

  businessRevenue: 0,
  businessExpenses: 0,
  blueDeduction: '650k',
  familySalary: 0,
  socialInsurance: 0,
  mutualAidInsurance: 0,
  hasSpouse: false,
  hasDependents: false,
  spouseIncome: 0,
  spouseAge70OrOver: false,
  dependents16To18: 0,
  dependents19To22: 0,
  dependentsGeneral: 0,
  dependentsElderlyLiving: 0,
  dependentsElderlySeparate: 0,
  singleParentType: 'none',
  generalDisabledCount: 0,
  specialDisabledCount: 0,
  livingSpecialDisabledCount: 0,
  lifeInsurancePremium: 0,
  earthquakeInsurancePremium: 0,
  medicalExpenses: 0,
  mortgageDeduction: 0,
  otherIncome: 0,
};

export interface CalculationStep {
  stepNumber: number;
  title: string;
  badge: string;
  description: string;
  formula: string;
  formulaWithValues: string;
  resultFormatted: string;
}

export interface TaxCalculationResult {
  businessIncome: number;
  totalIncome: number;
  totalDeductionsIncomeTax: number;
  totalDeductionsResidentTax: number;
  taxableIncome: number;
  taxableIncomeResidentTax: number;
  marginalIncomeTaxRate: number;
  effectiveIncomeTaxRate: number;
  residentTaxIncomePercent: number;
  adjustmentDeduction: number;
  hometownTaxLimit: number;
  steps: CalculationStep[];
}
