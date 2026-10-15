import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateHometownTax } from '../domain/calculator/hometownTax';
import type { TaxCalculationResult, UserInputState } from '../domain/calculator/types';
import { DEFAULT_USER_INPUT } from '../domain/calculator/types';

const STORAGE_KEY_INPUTS = 'furusato_sim_inputs_v1';
const STORAGE_KEY_SIMPLE_MODE = 'furusato_sim_mode_simple_v1';

export function useTaxCalculator() {
  const [inputs, setInputs] = useState<UserInputState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INPUTS);
      if (saved) {
        return { ...DEFAULT_USER_INPUT, ...JSON.parse(saved) };
      }
    } catch {
      // noop
    }
    return DEFAULT_USER_INPUT;
  });

  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SIMPLE_MODE);
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (JSON.stringify(inputs) === JSON.stringify(DEFAULT_USER_INPUT)) {
        localStorage.removeItem(STORAGE_KEY_INPUTS);
      } else {
        localStorage.setItem(STORAGE_KEY_INPUTS, JSON.stringify(inputs));
      }
    } catch {
      // noop
    }
  }, [inputs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SIMPLE_MODE, JSON.stringify(isSimpleMode));
    } catch {
      // noop
    }
  }, [isSimpleMode]);

  const updateField = useCallback(
    <K extends keyof UserInputState>(key: K, value: UserInputState[K]) => {
      setInputs((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const saveInputs = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INPUTS, JSON.stringify(inputs));
      localStorage.setItem(STORAGE_KEY_SIMPLE_MODE, JSON.stringify(isSimpleMode));
      setLastSavedAt(new Date());
      return true;
    } catch (e) {
      console.error('Failed to save to localStorage', e);
      return false;
    }
  }, [inputs, isSimpleMode]);

  const resetInputs = useCallback(() => {
    setInputs(DEFAULT_USER_INPUT);
    setLastSavedAt(null);
    try {
      localStorage.removeItem(STORAGE_KEY_INPUTS);
    } catch {
      // noop
    }
  }, []);

  const clearInputs = resetInputs;

  const toggleMode = useCallback(() => {
    setIsSimpleMode((prev) => !prev);
  }, []);

  const result: TaxCalculationResult = useMemo(() => {
    return calculateHometownTax(inputs, isSimpleMode);
  }, [inputs, isSimpleMode]);

  return {
    inputs,
    updateField,
    resetInputs,
    clearInputs,
    saveInputs,
    lastSavedAt,
    isSimpleMode,
    setIsSimpleMode,
    toggleMode,
    result,
  };
}
