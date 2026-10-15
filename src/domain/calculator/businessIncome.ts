import type { BlueDeductionType } from './types';

export const BLUE_DEDUCTION_AMOUNTS: Record<BlueDeductionType, number> = {
  none: 0,
  '100k': 100_000,
  '550k': 550_000,
  '650k': 650_000,
};

export interface BusinessIncomeResult {
  profitBeforeBlue: number;
  actualBlueDeduction: number;
  businessIncome: number;
}

/**
 * 事業所得の計算
 * 売上 - 必要経費 - 専従者給与 - 青色申告特別控除
 * ※青色申告控除は赤字にすることはできず、引く前の利益が上限
 */
export function calcBusinessIncome(
  revenue: number,
  expenses: number,
  blueType: BlueDeductionType,
  familySalary: number,
): BusinessIncomeResult {
  const safeRevenue = Math.max(0, revenue);
  const safeExpenses = Math.max(0, expenses);
  const safeFamilySalary = Math.max(0, familySalary);

  const profitBeforeBlue = Math.max(0, safeRevenue - safeExpenses - safeFamilySalary);
  const maxBlue = BLUE_DEDUCTION_AMOUNTS[blueType] || 0;
  const actualBlueDeduction = Math.min(profitBeforeBlue, maxBlue);
  const businessIncome = Math.max(0, profitBeforeBlue - actualBlueDeduction);

  return {
    profitBeforeBlue,
    actualBlueDeduction,
    businessIncome,
  };
}
