import React from 'react';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-800/95 text-white border-emerald-600',
    info: 'bg-slate-800/95 text-white border-slate-600',
    error: 'bg-rose-800/95 text-white border-rose-600',
  }[type];

  const Icon = {
    success: CheckCircle2,
    info: Info,
    error: AlertCircle,
  }[type];

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg border text-xs sm:text-sm font-semibold backdrop-blur-xs ${bgStyles}`}>
        <Icon size={16} className="text-emerald-300 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
};
