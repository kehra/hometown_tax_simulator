import { HelpCircle } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface HelpTooltipProps {
  text: string;
  title?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ text, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  // 外側クリックで閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <span ref={containerRef} className="relative inline-flex items-center ml-1 align-middle">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="解説を見る"
        className="text-slate-400 hover:text-emerald-600 focus:outline-hidden transition-colors cursor-pointer"
      >
        <HelpCircle size={16} />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-150">
          {title && <p className="font-bold text-emerald-400 mb-1">{title}</p>}
          <p className="leading-relaxed text-slate-200">{text}</p>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
        </div>
      )}
    </span>
  );
};
