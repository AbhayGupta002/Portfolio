import React from 'react';
import { Settings, Edit3, Eye, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminFloatingBar: React.FC = () => {
  const { isAdminMode, toggleAdminMode, openAdminModal } = usePortfolioData();
  const { currentUser, isAuthenticated } = useAuth();
  const { isDark } = useTheme();

  // Hidden completely from visitors when not authenticated as admin
  if (!isAuthenticated || !isAdminMode) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 select-none">
      <div
        className={`flex items-center gap-2 p-1.5 pl-3 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all animate-fadeIn ${
          isDark
            ? 'bg-[#091122]/95 border-cyan-500/50 text-white shadow-[0_10px_40px_rgba(6,182,212,0.3)]'
            : 'bg-white/95 border-blue-400 text-slate-900 shadow-xl'
        }`}
      >
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 dark:text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Admin Mode:</span> ACTIVE
        </div>

        {currentUser && (
          <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/10 text-cyan-400 border border-blue-500/20 text-[11px] font-mono">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            {currentUser.email}
          </span>
        )}

        <button
          type="button"
          onClick={() => openAdminModal('autofill')}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-sm transition"
          title="Upload Resume to Auto-Fill Portfolio"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Auto-Fill</span> CV
        </button>

        <button
          type="button"
          onClick={() => openAdminModal('profile')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Master Panel</span>
        </button>

        <button
          type="button"
          onClick={toggleAdminMode}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition ${
            isDark
              ? 'border-blue-900/40 text-slate-400 hover:text-white hover:bg-[#132238]'
              : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Exit Admin Edit Mode"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline ml-1">View As Visitor</span>
        </button>
      </div>
    </div>
  );
};
