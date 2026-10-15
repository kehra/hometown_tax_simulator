import type { UserInputState } from './types';

export interface DeductionsResult {
  basicDeductionIncomeTax: number;
  basicDeductionResidentTax: number;
  socialInsuranceDeduction: number;
  mutualAidDeduction: number;
  spouseDeductionIncomeTax: number;
  spouseDeductionResidentTax: number;
  dependentDeductionIncomeTax: number;
  dependentDeductionResidentTax: number;
  singleParentDeductionIncomeTax: number;
  singleParentDeductionResidentTax: number;
  disabilityDeductionIncomeTax: number;
  disabilityDeductionResidentTax: number;
  lifeInsuranceDeductionIncomeTax: number;
  lifeInsuranceDeductionResidentTax: number;
  earthquakeInsuranceDeductionIncomeTax: number;
  earthquakeInsuranceDeductionResidentTax: number;
  medicalExpensesDeduction: number;
  
  incomeTaxDeductions: number;
  residentTaxDeductions: number;
  humanDeductionDiff: number;
  adjustmentDeduction: number;
}

/**
 * 基礎控除の算出
 */
function calcBasicDeduction(totalIncome: number): { incomeTax: number; residentTax: number; diff: number } {
  if (totalIncome <= 24_000_000) {
    return { incomeTax: 480_000, residentTax: 430_000, diff: 50_000 };
  } else if (totalIncome <= 24_500_000) {
    return { incomeTax: 320_000, residentTax: 290_000, diff: 30_000 };
  } else if (totalIncome <= 25_000_000) {
    return { incomeTax: 160_000, residentTax: 150_000, diff: 10_000 };
  }
  return { incomeTax: 0, residentTax: 0, diff: 0 };
}

/**
 * 配偶者控除・配偶者特別控除の算出
 */
function calcSpouseDeduction(
  hasSpouse: boolean,
  spouseIncome: number,
  spouseAge70OrOver: boolean,
  totalIncome: number
): { incomeTax: number; residentTax: number; diff: number } {
  if (!hasSpouse || totalIncome > 10_000_000) {
    return { incomeTax: 0, residentTax: 0, diff: 0 };
  }

  // 配偶者年収 103万円以下: 配偶者控除
  if (spouseIncome <= 1_030_000) {
    if (spouseAge70OrOver) {
      // 老人控除対象配偶者
      const incomeTax = totalIncome <= 9_000_000 ? 480_000 : totalIncome <= 9_500_000 ? 320_000 : 160_000;
      const residentTax = totalIncome <= 9_000_000 ? 380_000 : totalIncome <= 9_500_000 ? 260_000 : 130_000;
      return { incomeTax, residentTax, diff: 100_000 };
    } else {
      // 一般配偶者
      const incomeTax = totalIncome <= 9_000_000 ? 380_000 : totalIncome <= 9_500_000 ? 260_000 : 130_000;
      const residentTax = totalIncome <= 9_000_000 ? 330_000 : totalIncome <= 9_500_000 ? 220_000 : 110_000;
      return { incomeTax, residentTax, diff: 50_000 };
    }
  }

  // 配偶者年収 103万超〜201.6万円未満: 配偶者特別控除（本人所得900万以下の場合を基準）
  if (spouseIncome <= 1_500_000) {
    const factor = totalIncome <= 9_000_000 ? 1 : totalIncome <= 9_500_000 ? 2 / 3 : 1 / 3;
    const it = Math.round(380_000 * factor);
    const rt = Math.round(330_000 * factor);
    return { incomeTax: it, residentTax: rt, diff: 50_000 };
  } else if (spouseIncome <= 1_665_000) {
    return { incomeTax: 310_000, residentTax: 310_000, diff: 0 };
  } else if (spouseIncome <= 1_752_000) {
    return { incomeTax: 260_000, residentTax: 260_000, diff: 0 };
  } else if (spouseIncome <= 1_832_000) {
    return { incomeTax: 210_000, residentTax: 210_000, diff: 0 };
  } else if (spouseIncome <= 1_904_000) {
    return { incomeTax: 160_000, residentTax: 160_000, diff: 0 };
  } else if (spouseIncome <= 1_976_000) {
    return { incomeTax: 110_000, residentTax: 110_000, diff: 0 };
  } else if (spouseIncome < 2_016_000) {
    return { incomeTax: 60_000, residentTax: 60_000, diff: 0 };
  }

  return { incomeTax: 0, residentTax: 0, diff: 0 };
}

/**
 * 扶養控除の算出
 */
function calcDependentDeductions(input: UserInputState): { incomeTax: number; residentTax: number; diff: number } {
  if (!input.hasDependents) {
    return { incomeTax: 0, residentTax: 0, diff: 0 };
  }
  // 16〜18歳 (一般扶養) : 38万 / 33万 (差額5万)
  const c16_18 = input.dependents16To18 || 0;
  // 19〜22歳 (特定扶養) : 63万 / 45万 (差額18万)
  const c19_22 = input.dependents19To22 || 0;
  // 23〜69歳 (一般扶養) : 38万 / 33万 (差額5万)
  const cGeneral = input.dependentsGeneral || 0;
  // 70歳以上同居 : 58万 / 45万 (差額13万)
  const cElderlyLiving = input.dependentsElderlyLiving || 0;
  // 70歳以上別居 : 48万 / 38万 (差額10万)
  const cElderlySeparate = input.dependentsElderlySeparate || 0;

  const incomeTax =
    c16_18 * 380_000 +
    c19_22 * 630_000 +
    cGeneral * 380_000 +
    cElderlyLiving * 580_000 +
    cElderlySeparate * 480_000;

  const residentTax =
    c16_18 * 330_000 +
    c19_22 * 450_000 +
    cGeneral * 330_000 +
    cElderlyLiving * 450_000 +
    cElderlySeparate * 380_000;

  const diff =
    c16_18 * 50_000 +
    c19_22 * 180_000 +
    cGeneral * 50_000 +
    cElderlyLiving * 130_000 +
    cElderlySeparate * 100_000;

  return { incomeTax, residentTax, diff };
}

/**
 * 寡婦・ひとり親控除
 */
function calcSingleParentDeduction(type: UserInputState['singleParentType']): { incomeTax: number; residentTax: number; diff: number } {
  if (type === 'single_parent') {
    return { incomeTax: 350_000, residentTax: 300_000, diff: 50_000 };
  } else if (type === 'widow') {
    return { incomeTax: 270_000, residentTax: 260_000, diff: 10_000 };
  }
  return { incomeTax: 0, residentTax: 0, diff: 0 };
}

/**
 * 障害者控除
 */
function calcDisabilityDeduction(input: UserInputState): { incomeTax: number; residentTax: number; diff: number } {
  const g = input.generalDisabledCount || 0;
  const s = input.specialDisabledCount || 0;
  const ls = input.livingSpecialDisabledCount || 0;

  const incomeTax = g * 270_000 + s * 400_000 + ls * 750_000;
  const residentTax = g * 260_000 + s * 300_000 + ls * 530_000;
  const diff = g * 10_000 + s * 100_000 + ls * 220_000;

  return { incomeTax, residentTax, diff };
}

/**
 * 生命保険料控除（新制度基準・上限: 所得税12万円 / 住民税7万円）
 */
/**
 * 生命保険料控除（確定申告書B ⑮番の控除額）
 * 所得税上限12万円、住民税上限7万円
 */
function calcLifeInsuranceDeduction(deductionAmount: number): { incomeTax: number; residentTax: number } {
  const d = Math.max(0, Math.min(120_000, deductionAmount));
  if (d === 0) return { incomeTax: 0, residentTax: 0 };

  const incomeTax = d;
  // 住民税の控除額（最大7万円。所得税の控除額に連動）
  const residentTax = Math.min(70_000, Math.round(d * (70_000 / 120_000)));
  return { incomeTax, residentTax };
}

/**
 * 地震保険料控除（所得税最大5万円 / 住民税最大2.5万円）
 */
/**
 * 地震保険料控除（確定申告書B ⑯番の控除額）
 * 所得税上限5万円、住民税上限2.5万円（所得税の半額）
 */
function calcEarthquakeInsuranceDeduction(deductionAmount: number): { incomeTax: number; residentTax: number } {
  const d = Math.max(0, Math.min(50_000, deductionAmount));
  const incomeTax = d;
  const residentTax = Math.min(25_000, Math.floor(d / 2));
  return { incomeTax, residentTax };
}

/**
 * 医療費控除
 */
/**
 * 医療費控除（確定申告書B ⑰番の控除額、上限200万円）
 */
function calcMedicalExpensesDeduction(deductionAmount: number): number {
  return Math.max(0, Math.min(2_000_000, deductionAmount));
}

/**
 * 各種控除の合算および人的控除差額の計算
 */
export function calcDeductions(input: UserInputState, totalIncome: number): DeductionsResult {
  const basic = calcBasicDeduction(totalIncome);
  const spouse = calcSpouseDeduction(input.hasSpouse, input.spouseIncome, input.spouseAge70OrOver, totalIncome);
  const dependent = calcDependentDeductions(input);
  const singleParent = calcSingleParentDeduction(input.singleParentType);
  const disability = calcDisabilityDeduction(input);

  const socialInsuranceDeduction = Math.max(0, input.socialInsurance);
  const mutualAidDeduction = Math.max(0, input.mutualAidInsurance);

  const life = calcLifeInsuranceDeduction(input.lifeInsurancePremium);
  const earthquake = calcEarthquakeInsuranceDeduction(input.earthquakeInsurancePremium);
  const medicalExpensesDeduction = calcMedicalExpensesDeduction(input.medicalExpenses);

  const humanDeductionDiff =
    basic.diff + spouse.diff + dependent.diff + singleParent.diff + disability.diff;

  const incomeTaxDeductions =
    basic.incomeTax +
    spouse.incomeTax +
    dependent.incomeTax +
    singleParent.incomeTax +
    disability.incomeTax +
    socialInsuranceDeduction +
    mutualAidDeduction +
    life.incomeTax +
    earthquake.incomeTax +
    medicalExpensesDeduction;

  const residentTaxDeductions =
    basic.residentTax +
    spouse.residentTax +
    dependent.residentTax +
    singleParent.residentTax +
    disability.residentTax +
    socialInsuranceDeduction +
    mutualAidDeduction +
    life.residentTax +
    earthquake.residentTax +
    medicalExpensesDeduction;

  // 調整控除の計算（課税所得ベースでの概算調整）
  const taxableForAdjustment = Math.max(0, totalIncome - residentTaxDeductions);
  let adjustmentDeduction = 0;
  if (taxableForAdjustment > 0) {
    if (taxableForAdjustment <= 2_000_000) {
      adjustmentDeduction = Math.floor(Math.min(humanDeductionDiff, taxableForAdjustment) * 0.05);
    } else {
      adjustmentDeduction = Math.floor(
        Math.max(2_500, (humanDeductionDiff - (taxableForAdjustment - 2_000_000)) * 0.05)
      );
    }
  }

  return {
    basicDeductionIncomeTax: basic.incomeTax,
    basicDeductionResidentTax: basic.residentTax,
    socialInsuranceDeduction,
    mutualAidDeduction,
    spouseDeductionIncomeTax: spouse.incomeTax,
    spouseDeductionResidentTax: spouse.residentTax,
    dependentDeductionIncomeTax: dependent.incomeTax,
    dependentDeductionResidentTax: dependent.residentTax,
    singleParentDeductionIncomeTax: singleParent.incomeTax,
    singleParentDeductionResidentTax: singleParent.residentTax,
    disabilityDeductionIncomeTax: disability.incomeTax,
    disabilityDeductionResidentTax: disability.residentTax,
    lifeInsuranceDeductionIncomeTax: life.incomeTax,
    lifeInsuranceDeductionResidentTax: life.residentTax,
    earthquakeInsuranceDeductionIncomeTax: earthquake.incomeTax,
    earthquakeInsuranceDeductionResidentTax: earthquake.residentTax,
    medicalExpensesDeduction,
    incomeTaxDeductions,
    residentTaxDeductions,
    humanDeductionDiff,
    adjustmentDeduction,
  };
}
