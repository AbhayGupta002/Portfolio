import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Copy, Check, FileDown, Mail } from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { useTheme } from '../../context/ThemeContext';

export const FloatingQuickDock: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('About');
  const [copied, setCopied] = useState(false);
  const { profile, openResumeHeist } = usePortfolioData();
  const { isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      // Show dock when scrolled down > 350px
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      // Determine active section name
      const sections = [
        { id: 'about', name: 'About' },
        { id: 'architecture-blueprint', name: 'Architecture' },
        { id: 'experience', name: 'Experience' },
        { id: 'projects', name: 'Projects' },
        { id: 'education', name: 'Education' },
        { id: 'contact', name: 'Contact' },
      ];

      const scrollPos = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].name);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyEmail = () => {
    if (profile.email) {
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          navigator.clipboard.writeText(profile.email).catch(() => {});
        }
      } catch {
        // ignore clipboard error on mobile
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-5 right-4 sm:right-6 z-40 flex items-center gap-1.5 p-1.5 rounded-2xl border backdrop-blur-xl shadow-xl transition-colors duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(11, 21, 40, 0.85)' : 'rgba(255, 255, 255, 0.92)',
            borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(226, 232, 240, 0.9)',
            boxShadow: isDark ? '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 16px rgba(6, 182, 212, 0.15)' : '0 10px 30px rgba(15, 23, 42, 0.08)',
          }}
        >
          {/* Current Section Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#071120] border border-slate-300/70 dark:border-blue-900/50 text-[11px] font-mono text-slate-900 dark:text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-bold">{activeSection}</span>
          </div>

          {/* Quick Copy Email Button */}
          <button
            type="button"
            onClick={copyEmail}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#132238]"
            title={`Copy ${profile.email}`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] text-emerald-500 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
                <span className="hidden md:inline text-[11px]">Copy Email</span>
              </>
            )}
          </button>

          {/* Quick Resume Button */}
          <button
            type="button"
            onClick={openResumeHeist}
            className="p-2 rounded-xl text-xs font-mono font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#132238]"
            title="Download Résumé"
          >
            <FileDown className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          </button>

          {/* Back to Top Button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center justify-center p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Back to Top"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};