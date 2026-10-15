import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaxCalculator } from '../hooks/useTaxCalculator';

describe('useTaxCalculator Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default inputs', () => {
    const { result } = renderHook(() => useTaxCalculator());
    expect(result.current.inputs.easyTaxableIncome).toBe(0);
    expect(result.current.result.hometownTaxLimit).toBe(0);
  });

  it('calculates in simple mode with taxable income', () => {
    const { result } = renderHook(() => useTaxCalculator());

    act(() => {
      result.current.updateField('easyTaxableIncome', 3_500_000);
    });

    expect(result.current.inputs.easyTaxableIncome).toBe(3_500_000);
    expect(result.current.result.taxableIncome).toBe(3_500_000);
    expect(result.current.result.hometownTaxLimit).toBeGreaterThan(80_000);
  });

  it('calculates in detailed mode with business revenue and deductions', () => {
    const { result } = renderHook(() => useTaxCalculator());

    act(() => {
      result.current.setIsSimpleMode(false);
      result.current.updateField('businessRevenue', 8_000_000);
      result.current.updateField('businessExpenses', 3_000_000);
      result.current.updateField('blueDeduction', '650k');
      result.current.updateField('socialInsurance', 800_000);
      result.current.updateField('mutualAidInsurance', 240_000);
    });

    expect(result.current.inputs.businessRevenue).toBe(8_000_000);
    expect(result.current.result.businessIncome).toBe(4_350_000);
    expect(result.current.result.hometownTaxLimit).toBeGreaterThan(70_000);
  });

  it('resets inputs to default on resetInputs()', () => {
    const { result } = renderHook(() => useTaxCalculator());

    act(() => {
      result.current.updateField('easyTaxableIncome', 5_000_000);
    });
    expect(result.current.inputs.easyTaxableIncome).toBe(5_000_000);

    act(() => {
      result.current.resetInputs();
    });
    expect(result.current.inputs.easyTaxableIncome).toBe(0);
    expect(result.current.result.hometownTaxLimit).toBe(0);
  });

  it('saves inputs to localStorage on saveInputs()', () => {
    const { result } = renderHook(() => useTaxCalculator());

    act(() => {
      result.current.updateField('easyTaxableIncome', 4_000_000);
    });

    let success = false;
    act(() => {
      success = result.current.saveInputs();
    });

    expect(success).toBe(true);
    const stored = localStorage.getItem('furusato_sim_inputs_v1');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!).easyTaxableIncome).toBe(4_000_000);

    act(() => {
      result.current.clearInputs();
    });

    expect(result.current.inputs.easyTaxableIncome).toBe(0);
    expect(localStorage.getItem('furusato_sim_inputs_v1')).toBeNull();
  });
});
