import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, Download, Menu, X, Settings, LogOut, ChevronDown, ShieldCheck, Film, Play } from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useSecretAdminTrigger } from '../../hooks/useSecretAdminTrigger';

const navLinks = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Architecture', href: '#architecture-blueprint', id: 'architecture-blueprint' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Education', href: '#education', id: 'education' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const { isDark, toggleTheme } = useTheme();

  // Scroll Progress calculation for top neon bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Track active section for ScrollSpy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const el = document.getElementById(navLinks[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background page from scrolling when mobile menu drawer is open
  useBodyScrollLock(mobileMenuOpen);

  // Stealth admin login triggers (URL #admin, Ctrl+Shift+A hotkey, and 3x logo clicks)
  const { triggerSecretClick } = useSecretAdminTrigger();

  const {
    profile,
    isAdminMode,
    setIsAdminMode,
    openAdminModal,
    openResumeHeist,
    openOneShot,
  } = usePortfolioData();

  const { currentUser, isAuthenticated, logout } = useAuth();

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
    <header className={`fixed inset-x-0 top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300 ${
      isDark
        ? 'border-blue-900/40 bg-[#091122]/90 shadow-[0_4px_30px_rgba(0,0,0,0.5)] text-white'
        : 'border-slate-200/90 bg-white/95 shadow-[0_4px_25px_rgba(15,23,42,0.06)] text-[#0F172A]'
    }`}>
      {/* Top Neon Scroll Progress Bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5">
        <a
          href="#about"
          onClick={triggerSecretClick}
          className="group flex items-center gap-2.5 sm:gap-3 shrink-0 cursor-pointer"
          aria-label={`${profile.name}, home`}
        >
          <span className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-xs font-bold tracking-wide transition-all shrink-0 overflow-hidden border group-hover:scale-105 ${
            isDark
              ? 'border-cyan-500/40 bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
              : 'border-slate-300 bg-blue-600 text-white shadow-sm'
          }`}>
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
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
          <div className="flex flex-col">
            <span className={`text-sm font-bold tracking-tight truncate max-w-[130px] sm:max-w-none transition-colors ${
              isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-blue-600'
            }`}>
              {profile.name}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links with Animated Scrollspy Pill */}
        <div className="hidden items-center gap-1 md:flex bg-slate-100/60 dark:bg-[#071120]/70 p-1 rounded-2xl border border-slate-200/60 dark:border-blue-900/40 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative rounded-xl px-3.5 py-1.5 text-xs font-mono font-medium transition-colors ${
                  isActive
                    ? isDark
                      ? 'text-cyan-300 font-bold'
                      : 'text-blue-600 font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    className={`absolute inset-0 rounded-xl -z-10 ${
                      isDark
                        ? 'bg-blue-600/25 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                        : 'bg-white border border-blue-200/90 shadow-xs'
                    }`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2.5 md:flex">
          {/* Admin Panel Button & Dropdown */}
          {isAuthenticated ? (
            <div id="admin-dropdown-container" className="relative">
              <button
                type="button"
                onClick={() => setAdminDropdownOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
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
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
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
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition cursor-pointer"
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

          {/* Dark Mode / Light Mode Interactive Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex items-center justify-center rounded-xl border p-2 text-xs font-mono font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isDark
                ? 'border-blue-500/40 bg-[#0F1C33] text-yellow-300 hover:bg-[#162744] hover:border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.15)]'
                : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-400 shadow-2xs'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            <span className="text-sm transition-transform duration-300 hover:rotate-12">{isDark ? '🌙' : '☀️'}</span>
          </button>

          {/* Play Button */}
          <button
            type="button"
            onClick={openOneShot}
            className={`group inline-flex items-center justify-center rounded-xl p-2.5 text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer border ${
              isDark
                ? 'border-cyan-500/40 bg-gradient-to-r from-blue-900/40 via-cyan-950/40 to-blue-900/40 text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.25)] hover:border-cyan-300 hover:text-white'
                : 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-xs hover:border-blue-500 hover:bg-blue-100/80'
            }`}
            title="Play Tour: Java Backend Journey"
            aria-label="Play Tour"
          >
            <Play className="h-3.5 w-3.5 fill-current text-blue-600 dark:text-cyan-400 ml-0.5 transition-transform group-hover:scale-110" />
          </button>

          <a
            href="#contact"
            className={`rounded-xl px-3.5 py-2 text-xs font-mono font-semibold transition-all hover:scale-105 active:scale-95 ${
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
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20'
            }`}
          >
            <Download className="h-3.5 w-3.5" /> Résumé
          </button>
        </div>

        {/* Mobile Actions: Play Button + Theme Toggle + (Admin Button only when authenticated) + Hamburger Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
          <button
            type="button"
            onClick={openOneShot}
            className={`flex items-center justify-center rounded-xl border p-2 text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer ${
              isDark
                ? 'border-cyan-500/40 bg-blue-950/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'border-blue-300 bg-blue-50 text-blue-700 shadow-xs'
            }`}
            title="Play Tour"
            aria-label="Play Tour"
          >
            <Play className="w-3.5 h-3.5 fill-current text-blue-600 dark:text-cyan-400 ml-0.5" />
          </button>

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                setIsAdminMode(true);
                openAdminModal('profile');
              }}
              className={`flex items-center gap-1 rounded-xl border p-2 text-xs font-mono font-semibold transition-colors cursor-pointer ${
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
            className={`flex items-center justify-center rounded-xl border p-2 text-xs font-mono font-semibold transition-all active:scale-95 cursor-pointer ${
              isDark
                ? 'border-blue-500/40 bg-[#0F1C33] text-yellow-300'
                : 'border-slate-300 bg-slate-50 text-slate-700'
            }`}
            aria-label="Toggle theme"
          >
            <span className="text-sm">{isDark ? '🌙' : '☀️'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={`rounded-xl border p-2 transition-colors cursor-pointer ${
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

      {/* Mobile Dropdown Menu with Active Section Highlights */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Dimming Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-[57px] sm:top-[65px] z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Mobile Dropdown Panel */}
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
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-mono font-semibold transition-all ${
                        isActive
                          ? isDark
                            ? 'bg-blue-600/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-blue-50 text-blue-600 border border-blue-200'
                          : isDark
                          ? 'text-slate-200 hover:bg-[#132238] hover:text-cyan-400'
                          : 'text-slate-800 hover:bg-slate-100 hover:text-blue-600'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className={`h-4 w-4 ${isActive ? (isDark ? 'text-cyan-300' : 'text-blue-600') : 'opacity-40'}`} />
                    </a>
                  );
                })}
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
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold border transition cursor-pointer ${
                      isDark
                        ? 'border-blue-500/40 bg-blue-950/50 text-cyan-300 hover:bg-blue-900/60'
                        : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <Settings className="h-4 w-4" /> Open Admin Edit Panel
                  </button>
                )}

                {/* Play Tour Mobile Drawer Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openOneShot();
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold border transition active:scale-95 cursor-pointer ${
                    isDark
                      ? 'border-cyan-500/50 bg-gradient-to-r from-blue-900/60 to-cyan-900/40 text-cyan-300 shadow-md'
                      : 'border-blue-300 bg-blue-50 text-blue-700 shadow-xs'
                  }`}
                >
                  <Play className="h-4 w-4 fill-current text-blue-600 dark:text-cyan-400 ml-0.5" />
                  <span>Play Tour: Java Architecture</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openResumeHeist();
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-white shadow-md transition active:scale-95 cursor-pointer ${
                    isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
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
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold border transition cursor-pointer ${
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
