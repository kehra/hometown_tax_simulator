import React from 'react';
import { Sparkles, Save, Trash2, Zap, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  isSimpleMode: boolean;
  onToggleMode: (isSimple: boolean) => void;
  onReset: () => void;
  onSave?: () => void;
  hasInputValues: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isSimpleMode,
  onToggleMode,
  onReset,
  onSave,
  hasInputValues,
}) => {
  const handleResetClick = () => {
    if (!hasInputValues || window.confirm('入力内容とキャッシュをすべてクリアしてもよろしいですか？')) {
      onReset();
    }
  };

  return (
    <header className="pt-6 pb-4 px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
        <Sparkles size={14} className="text-emerald-600" />
        <span>個人事業主・フリーランス専用</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight my-2">
        ふるさと納税シミュレータ
      </h1>

      <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed mb-5">
        売上・経費・青色申告控除から、上限額と計算プロセスをステップ順にまるごと可視化！
      </p>

      {/* モード切替 */}
      <div className="flex items-center justify-between max-w-md mx-auto bg-slate-100 p-1 rounded-2xl mb-3 shadow-inner">
        <button
          type="button"
          onClick={() => onToggleMode(true)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            isSimpleMode
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap size={15} />
          <span>かんたんモード</span>
        </button>
        <button
          type="button"
          onClick={() => onToggleMode(false)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            !isSimpleMode
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <SlidersHorizontal size={15} />
          <span>詳細モード</span>
        </button>
      </div>

      {/* キャッシュ保存 ＆ クリアボタン */}
      <div className="flex items-center justify-center gap-2.5 max-w-md mx-auto">
        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          title="入力内容をブラウザに明示的に保存します"
        >
          <Save size={14} className="text-emerald-600" />
          <span>入力を保存</span>
        </button>

        <button
          type="button"
          onClick={handleResetClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          title="入力値と保存されたキャッシュをすべてクリアします"
        >
          <Trash2 size={14} />
          <span>クリア</span>
        </button>
      </div>

      <p className="text-[11px] text-slate-400 mt-2 font-normal">
        ※ 入力内容はブラウザに自動保存されます（次回アクセス時も復元）
      </p>
    </header>
  );
};

