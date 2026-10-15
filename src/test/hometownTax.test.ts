import { describe, it, expect } from 'vitest';
import { calculateHometownTax } from '../domain/calculator/hometownTax';
import { DEFAULT_USER_INPUT } from '../domain/calculator/types';
import type { UserInputState } from '../domain/calculator/types';

describe('Hometown Tax Calculation & Step Breakdown', () => {
  it('calculates realistic freelance scenario correctly', () => {
    const input: UserInputState = {
      ...DEFAULT_USER_INPUT,
      businessRevenue: 8_000_000,
      businessExpenses: 3_000_000,
      blueDeduction: '650k',
      socialInsurance: 800_000,
      mutualAidInsurance: 240_000,
    };

    const result = calculateHometownTax(input);
    expect(result.businessIncome).toBe(4_350_000);
    expect(result.totalDeductionsIncomeTax).toBe(1_520_000);
    expect(result.totalDeductionsResidentTax).toBe(1_470_000);
    expect(result.taxableIncome).toBe(2_830_000);
    expect(result.taxableIncomeResidentTax).toBe(2_880_000);
    expect(result.marginalIncomeTaxRate).toBe(0.10);
    expect(result.effectiveIncomeTaxRate).toBeCloseTo(0.1021, 4);
    expect(result.residentTaxIncomePercent).toBe(285_500);
    expect(result.hometownTaxLimit).toBeGreaterThan(70_000);
    expect(result.hometownTaxLimit).toBeLessThan(75_000);

    expect(result.steps).toHaveLength(5);
    const step5 = result.steps[4];
    expect(step5.formulaWithValues).toContain('285,500');
    expect(step5.formulaWithValues).toContain('10.21%');
  });

  it('returns 0 limit when income is zero or below tax threshold', () => {
    const input: UserInputState = {
      ...DEFAULT_USER_INPUT,
      businessRevenue: 500_000,
      businessExpenses: 300_000,
    };
    const result = calculateHometownTax(input);
    expect(result.hometownTaxLimit).toBe(0);
    expect(result.steps).toHaveLength(5);
  });

  it('applies mortgage deduction to resident tax when excess exists', () => {
    const inputWithoutMortgage: UserInputState = {
      ...DEFAULT_USER_INPUT,
      businessRevenue: 8_000_000,
      businessExpenses: 3_000_000,
      blueDeduction: '650k',
      socialInsurance: 800_000,
      mortgageDeduction: 0,
    };
    const inputWithMortgage: UserInputState = {
      ...inputWithoutMortgage,
      mortgageDeduction: 300_000,
    };

    const resNoMortgage = calculateHometownTax(inputWithoutMortgage);
    const resWithMortgage = calculateHometownTax(inputWithMortgage);

    expect(resWithMortgage.residentTaxIncomePercent).toBeLessThan(resNoMortgage.residentTaxIncomePercent);
    expect(resWithMortgage.hometownTaxLimit).toBeLessThan(resNoMortgage.hometownTaxLimit);
  });
});
