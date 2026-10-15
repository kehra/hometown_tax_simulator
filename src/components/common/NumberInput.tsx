import React, { useState, useEffect } from 'react';
import { HelpTooltip } from './HelpTooltip';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  tooltip?: string;
  placeholder?: string;
  unit?: string;
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  hint,
  tooltip,
  placeholder = '0',
  unit = '円',
  disabled = false,
}) => {
  const [displayValue, setDisplayValue] = useState<string>(() => {
    return value === 0 ? '' : value.toLocaleString('ja-JP');
  });

  useEffect(() => {
    setDisplayValue(value === 0 ? '' : value.toLocaleString('ja-JP'));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
      .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/[^0-9]/g, '');

    if (raw === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      setDisplayValue(num.toLocaleString('ja-JP'));
      onChange(num);
    }
  };

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-slate-800 flex items-center">
          {label}
          {tooltip && <HelpTooltip text={tooltip} title={label} />}
        </label>
        {hint && <span className="text-xs text-slate-500 font-normal">{hint}</span>}
      </div>

      <div className="relative rounded-2xl shadow-xs transition-all">
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-right pr-12 text-slate-800 font-medium text-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-300 disabled:bg-slate-100 disabled:text-slate-400"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm pointer-events-none">
          {unit}
        </span>
      </div>
    </div>
  );
};
