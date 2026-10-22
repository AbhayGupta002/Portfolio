import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Download, Menu, X, Settings, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useSecretAdminTrigger } from '../../hooks/useSecretAdminTrigger';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Architecture', href: '#architecture-blueprint' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // Prevent background page from scrolling when mobile menu drawer is open
  useBodyScrollLock(mobileMenuOpen);

  // Stealth admin login triggers (URL #admin, Ctrl+Shift+A hotkey, and 3x logo clicks)
  const { triggerSecretClick } = useSecretAdminTrigger();

  const {
    profile,
    isAdminMode,
    setIsAdminMode,
    toggleAdminMode,
    openAdminModal,
    openResumeHeist,
  } = usePortfolioData();

  const { currentUser, isAuthenticated, logout, openAuthModal } = useAuth();

  // Close desktop admin dropdown on outside click
  useEffect(() => {
    if (!adminDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const container = document.getElementById('admin-dropdown-container');
      if (container && !container.contains(e.target as Node)) {
        setAdminDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [adminDropdownOpen]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-300 ${
      isDark
        ? 'border-blue-900/40 bg-[#091122]/90 shadow-[0_4px_24px_rgba(0,0,0,0.4)] text-white'
        : 'border-slate-200/90 bg-white/95 shadow-[0_4px_20px_rgba(18,34,29,0.05)] text-[#17251f]'
    }`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5">
        <a
          href="#about"
          onClick={triggerSecretClick}
          className="flex items-center gap-2 sm:gap-3 shrink-0 cursor-pointer"
          aria-label={`${profile.name}, home`}
        >
          <span className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-xs font-bold tracking-wide transition-all shrink-0 overflow-hidden border ${
            isDark
              ? 'border-cyan-500/40 bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'border-slate-300 bg-[#173b31] text-white'
          }`}>
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-full w-full object-cover object-top"
                style={{
                  filter: `brightness(${profile.photoBrightness || 104}%) contrast(${profile.photoContrast || 102}%)`,
                }}
              />
            ) : (
              <span>
                {profile.name
                  ? profile.name
                      .split(' ')
                      .map((n) => n[0])
                      .filter(Boolean)
                      .join('')
                      .slice(0, 2)
                      .toUpperCase() || 'AG'
                  : 'AG'}
              </span>
            )}
          </span>
          <span className={`text-sm font-bold tracking-tight truncate max-w-[125px] sm:max-w-none ${isDark ? 'text-white' : 'text-[#17251f]'}`}>
            {profile.name}
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                isDark
                  ? 'text-[#94A3B8] hover:bg-[#132238] hover:text-cyan-300'
                  : 'text-[#475569] hover:bg-slate-100 hover:text-blue-600'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2.5 md:flex">
          {/* Admin Panel Button & Dropdown */}
          {isAuthenticated ? (
            <div id="admin-dropdown-container" className="relative">
              <button
                type="button"
                onClick={() => setAdminDropdownOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 ${
                  isAdminMode
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                    : isDark
                    ? 'border-blue-900/50 bg-[#0F1C33] text-slate-300 hover:text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
                title="Admin Account Options"
                aria-expanded={adminDropdownOpen}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Admin</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${adminDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {adminDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 mt-2 w-52 rounded-2xl border p-1.5 shadow-2xl backdrop-blur-xl z-50 transition-colors ${
                      isDark
                        ? 'bg-[#0B1528] border-blue-900/60 text-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                        : 'bg-white border-slate-200 text-slate-800 shadow-xl'
                    }`}
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-blue-900/40">
                      <p className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> Admin Active
                      </p>
                      <p className="text-xs font-bold truncate text-blue-600 dark:text-cyan-400 mt-0.5">
                        {currentUser?.email || 'gupta.abhayit@gmail.com'}
                      </p>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setAdminDropdownOpen(false);
                          setIsAdminMode(true);
                          openAdminModal('profile');
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                          isDark ? 'hover:bg-[#132238] hover:text-cyan-400' : 'hover:bg-slate-100 hover:text-blue-600'
                        }`}
                      >
                        <Settings className="w-3.5 h-3.5 text-blue-500" />
                        <span>Open Admin Panel</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAdminDropdownOpen(false);
                          logout();
                          setIsAdminMode(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}

          {/* Dark Mode / Light Mode Emoji Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-mono font-medium transition-all hover:scale-105 active:scale-95 ${
              isDark
                ? 'border-blue-500/40 bg-[#0F1C33] text-yellow-300 hover:bg-[#162744] hover:border-yellow-400'
                : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-400'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            <span className="text-sm">{isDark ? '🌙' : '☀️'}</span>
            <span className="font-semibold">{isDark ? 'Night' : 'Day'}</span>
          </button>

          <a
            href="#contact"
            className={`rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${
              isDark
                ? 'text-[#CBD5E1] hover:bg-[#132238] hover:text-white'
                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
            }`}
          >
            Let’s talk
          </a>

          <button
            type="button"
            onClick={openResumeHeist}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white transition active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                : 'bg-[#173b31] hover:bg-[#245744]'
            }`}
          >
            <Download className="h-3.5 w-3.5" /> Resume
          </button>
        </div>

        {/* Mobile Actions: Emoji Toggle + (Admin Button only when authenticated) + Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                setIsAdminMode(true);
                openAdminModal('profile');
              }}
              className={`flex items-center gap-1 rounded-xl border p-2 text-xs font-mono font-semibold transition-colors ${
                isAdminMode
                  ? 'bg-blue-600 text-white border-blue-500'
                  : isDark
                  ? 'border-blue-900/50 bg-[#0F1C33] text-slate-300'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
              title="Admin Mode"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-mono font-semibold transition-colors ${
              isDark
                ? 'border-blue-500/40 bg-[#0F1C33] text-yellow-300'
                : 'border-slate-300 bg-slate-50 text-slate-700'
            }`}
            aria-label="Toggle theme"
          >
            <span>{isDark ? '🌙' : '☀️'}</span>
            <span className="text-[11px]">{isDark ? 'Night' : 'Day'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={`rounded-xl border p-2 transition-colors ${
              isDark
                ? 'border-blue-900/40 bg-[#0F1C33] text-white hover:bg-[#162744]'
                : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
            }`}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Dimming Blur Overlay (Click outside to close) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-[57px] sm:top-[65px] z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Mobile Dropdown Panel: Flush Full-Width attached directly below header */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`relative z-50 w-full border-t px-4 py-3 sm:px-6 sm:py-4 max-h-[calc(100vh-4.5rem)] overflow-y-auto overscroll-contain md:hidden transition-colors ${
                isDark
                  ? 'border-blue-900/40 bg-[#0B1528] text-white shadow-2xl'
                  : 'border-slate-200 bg-white text-slate-900 shadow-xl'
              }`}
            >
              <div className="mx-auto max-w-6xl space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                      isDark
                        ? 'text-slate-200 hover:bg-[#132238] hover:text-cyan-400'
                        : 'text-slate-800 hover:bg-slate-100 hover:text-blue-600'
                    }`}
                  >
                    {link.label}
                    <ArrowUpRight className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
                  </a>
                ))}
              </div>

              <div className="mx-auto max-w-6xl mt-3 pt-3 border-t border-slate-200 dark:border-blue-900/50 flex flex-col gap-2">
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsAdminMode(true);
                      openAdminModal('profile');
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold border transition ${
                      isDark
                        ? 'border-blue-500/40 bg-blue-950/50 text-cyan-300 hover:bg-blue-900/60'
                        : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <Settings className="h-4 w-4" /> Open Admin Edit Panel
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openResumeHeist();
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition active:scale-95 cursor-pointer ${
                    isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-[#173b31] hover:bg-[#245744]'
                  }`}
                >
                  <Download className="h-4 w-4" /> Download résumé
                </button>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsAdminMode(false);
                      logout();
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold border transition ${
                      isDark
                        ? 'border-red-500/40 bg-red-950/40 text-red-400 hover:bg-red-900/60'
                        : 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <LogOut className="h-4 w-4" /> Logout Admin
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
