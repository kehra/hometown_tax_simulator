import { describe, expect, it } from 'vitest';
import type { UserInputState } from '../domain/calculator/types';
import { DEFAULT_USER_INPUT } from '../domain/calculator/types';

describe('Domain Types and Default State', () => {
  it('should provide valid default UserInputState', () => {
    const input: UserInputState = DEFAULT_USER_INPUT;
    expect(input.businessRevenue).toBe(0);
    expect(input.businessExpenses).toBe(0);
    expect(input.blueDeduction).toBe('650k');
  });
});
