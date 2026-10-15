import { describe, it, expect } from 'vitest';
import { calcBusinessIncome } from '../domain/calculator/businessIncome';
import { calcDeductions } from '../domain/calculator/deductions';
import { DEFAULT_USER_INPUT } from '../domain/calculator/types';
import type { UserInputState } from '../domain/calculator/types';

describe('Business Income Calculator', () => {
  it('calculates business income correctly with 650k blue deduction', () => {
    const result = calcBusinessIncome(10_000_000, 3_000_000, '650k', 0);
    expect(result.actualBlueDeduction).toBe(650_000);
    expect(result.businessIncome).toBe(6_350_000);
  });

  it('caps blue deduction if profit before deduction is smaller than blue deduction', () => {
    const result = calcBusinessIncome(1_000_000, 700_000, '650k', 0);
    expect(result.actualBlueDeduction).toBe(300_000);
    expect(result.businessIncome).toBe(0);
  });

  it('handles zero or deficit revenue/expenses cleanly', () => {
    const result = calcBusinessIncome(2_000_000, 3_000_000, '650k', 0);
    expect(result.actualBlueDeduction).toBe(0);
    expect(result.businessIncome).toBe(0);
  });
});

describe('Deductions Calculator', () => {
  it('calculates standard single deduction with basic, social insurance, and mutual aid', () => {
    const input: UserInputState = {
      ...DEFAULT_USER_INPUT,
      socialInsurance: 800_000,
      mutualAidInsurance: 240_000,
    };
    const deductions = calcDeductions(input, 5_000_000);
    expect(deductions.incomeTaxDeductions).toBe(1_520_000);
    expect(deductions.residentTaxDeductions).toBe(1_470_000);
    expect(deductions.humanDeductionDiff).toBe(50_000);
  });

  it('calculates spouse and dependent deductions correctly', () => {
    const input: UserInputState = {
      ...DEFAULT_USER_INPUT,
      hasSpouse: true,
      spouseIncome: 1_000_000,
      hasDependents: true,
      dependents19To22: 1,
    };
    const deductions = calcDeductions(input, 6_000_000);
    expect(deductions.humanDeductionDiff).toBe(280_000);
    expect(deductions.incomeTaxDeductions).toBe(480_000 + 380_000 + 630_000);
    expect(deductions.residentTaxDeductions).toBe(430_000 + 330_000 + 450_000);
  });
});
