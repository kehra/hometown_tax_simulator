import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NumberInput } from '../components/common/NumberInput';

describe('NumberInput Component', () => {
  it('renders label and formats initial value with commas', () => {
    const handleChange = vi.fn();
    render(<NumberInput label="事業収入（売上）" value={8000000} onChange={handleChange} />);

    expect(screen.getByText('事業収入（売上）')).toBeDefined();
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('8,000,000');
  });

  it('calls onChange with parsed number when typing', () => {
    const handleChange = vi.fn();
    render(<NumberInput label="売上" value={0} onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '500000' } });
    expect(handleChange).toHaveBeenCalledWith(500000);
  });
});
