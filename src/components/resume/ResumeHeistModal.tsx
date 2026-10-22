import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Printer,
  ExternalLink,
  X,
  CheckCircle2,
  FileText,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Terminal,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { useTheme } from '../../context/ThemeContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export const ResumeHeistModal: React.FC = () => {
  const {
    isResumeHeistOpen,
    closeResumeHeist,
    profile,
    experiences,
    downloadFormattedResume,
  } = usePortfolioData();
  const { isDark } = useTheme();

  const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'experience' | 'skills'>('overview');

  // Prevent background page from scrolling when modal is open
  useBodyScrollLock(isResumeHeistOpen);

  if (!isResumeHeistOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) closeResumeHeist();
        }}
        className={`fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto select-none transition-all overscroll-contain ${
          isDark ? 'bg-black/85 backdrop-blur-xl' : 'bg-slate-900/60 backdrop-blur-md'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={`relative w-full max-w-3xl max-h-[90dvh] sm:max-h-[88vh] flex flex-col rounded-2xl sm:rounded-3xl border shadow-2xl overflow-hidden transition-colors ${
            isDark
              ? 'bg-[#0A1324] border-cyan-500/50 text-slate-100 shadow-[0_20px_80px_rgba(6,182,212,0.35)]'
              : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
          }`}
        >
          {/* Executive Header Banner */}
          <div
            className={`relative px-4 py-3 sm:px-6 sm:py-4.5 text-white overflow-hidden transition-colors ${
              isDark
                ? 'bg-gradient-to-r from-blue-950 via-indigo-950 to-[#0B1528] border-b border-cyan-500/30'
                : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700'
            }`}
          >
            {/* Background decorative glow */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                {/* Official Document Emblem Badge */}
                <div
                  className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border flex items-center justify-center shadow-md shrink-0 ${
                    isDark
                      ? 'bg-cyan-950/70 border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-white/20 border-white/60 text-white'
                  }`}
                >
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black tracking-tight truncate">
                      {profile.name} — Résumé
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-emerald-400 text-slate-950 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> VERIFIED
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-blue-100/90 mt-0.5 truncate">
                    {profile.title} • Official CV
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeResumeHeist}
                className="p-1.5 sm:p-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white transition shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Download Buttons & Tab Navigation */}
          <div
            className={`p-3 sm:p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 transition-colors ${
              isDark ? 'border-blue-900/40 bg-[#070D18]' : 'border-slate-200 bg-slate-50'
            }`}
          >
            {/* Primary Action Buttons */}
            <div className="flex items-center gap-2">
              <a
                href="/Abhay_Gupta_Resume.pdf"
                download="Abhay_Gupta_Resume.pdf"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-md active:scale-95 transition"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">Download PDF (72.9 KB)</span>
              </a>

              <button
                type="button"
                onClick={downloadFormattedResume}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl border text-[11px] sm:text-xs font-semibold active:scale-95 transition ${
                  isDark
                    ? 'border-blue-900/60 bg-[#0E1A30] text-slate-200 hover:text-white hover:border-cyan-500/50'
                    : 'border-slate-300 bg-white text-slate-700 hover:text-blue-600 hover:border-blue-400'
                }`}
                title="Print or save the custom styled resume"
              >
                <Printer className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline">Print CV</span>
              </button>

              <a
                href="/Abhay_Gupta_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 sm:p-2.5 rounded-xl border text-xs font-semibold active:scale-95 transition ${
                  isDark
                    ? 'border-blue-900/60 bg-[#0E1A30] text-slate-300 hover:text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:text-blue-600'
                }`}
                title="Open PDF in new browser tab"
              >
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            </div>

            {/* Segmented Tab Control */}
            <div
              className={`grid grid-cols-3 sm:flex items-center gap-1 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto ${
                isDark ? 'bg-[#0B1528]' : 'bg-slate-200/70'
              }`}
            >
              <button
                type="button"
                onClick={() => setActivePreviewTab('overview')}
                className={`text-center py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs transition ${
                  activePreviewTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('experience')}
                className={`text-center py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs transition ${
                  activePreviewTab === 'experience'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Experience ({experiences.length})
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('skills')}
                className={`text-center py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs transition ${
                  activePreviewTab === 'skills'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Skills
              </button>
            </div>
          </div>

          {/* Resume Content Body (Scrollable Preview) */}
          <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-6 text-sm overscroll-contain">
            {/* TAB 1: OVERVIEW */}
            {activePreviewTab === 'overview' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Candidate Header Snapshot */}
                <div
                  className={`p-5 rounded-2xl border space-y-3 transition-colors ${
                    isDark
                      ? 'border-blue-900/40 bg-[#070D18]/60'
                      : 'border-slate-200 bg-slate-50/70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {profile.name}
                      </h2>
                      <p className="text-sm font-semibold text-blue-600 dark:text-cyan-400">
                        {profile.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Hire
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" /> {profile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-blue-500" /> {profile.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-blue-500" /> {profile.phone}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-200 dark:border-blue-900/30">
                    {profile.bio || profile.summary}
                  </p>
                </div>

                {/* Core Attributes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    className={`p-3.5 rounded-xl border space-y-1 transition-colors ${
                      isDark
                        ? 'border-blue-900/30 bg-[#0B1528]'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      Primary Backend
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {profile.backendTech || 'Node.js, Express, REST APIs'}
                    </p>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border space-y-1 transition-colors ${
                      isDark
                        ? 'border-blue-900/30 bg-[#0B1528]'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      Frontend & UI
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {profile.frontendTech || 'React, TypeScript, Tailwind CSS'}
                    </p>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border space-y-1 transition-colors ${
                      isDark
                        ? 'border-blue-900/30 bg-[#0B1528]'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      Database & Cache
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {profile.databases || 'PostgreSQL, MongoDB, Redis'}
                    </p>
                  </div>
                </div>

                {/* Social Profiles */}
                <div className="flex flex-wrap items-center gap-3">
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        isDark
                          ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>GitHub Profile</span>
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        isDark
                          ? 'bg-blue-950/40 text-cyan-300 hover:bg-blue-900/60'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      <LinkedinIcon className="w-3.5 h-3.5" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: EXPERIENCE */}
            {activePreviewTab === 'experience' && (
              <div className="space-y-4 animate-fadeIn">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                  Verified Work Experience
                </h4>
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className={`p-4 rounded-2xl border space-y-2 transition-colors ${
                        isDark
                          ? 'border-blue-900/30 bg-[#0B1528]'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                          {exp.role} <span className="text-blue-500 font-normal">@ {exp.company}</span>
                        </h5>
                        <span className="text-xs font-mono text-slate-400">{exp.period}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">📍 {exp.location}</p>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {exp.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SKILLS */}
            {activePreviewTab === 'skills' && (
              <div className="space-y-4 animate-fadeIn">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-500" />
                  Core Technical Skills & Disciplines
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.primarySkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        isDark
                          ? 'bg-blue-600/10 text-cyan-400 border border-blue-500/20'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div
                  className={`p-4 rounded-2xl border space-y-2 mt-4 text-xs transition-colors ${
                    isDark
                      ? 'border-blue-900/30 bg-[#070D18]'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <p className="font-bold text-slate-800 dark:text-white">🎓 Education Details:</p>
                  {profile.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-slate-600 dark:text-slate-300"
                    >
                      <span>
                        {edu.degree} — {edu.institution}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">{edu.period}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Footer Action */}
          <div
            className={`p-3 sm:p-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 transition-colors ${
              isDark ? 'border-blue-900/40 bg-[#070D18]' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <span className="text-[11px] sm:text-xs font-mono text-slate-400 text-center sm:text-left">
              Official document format: <span className="font-bold text-blue-500">PDF (A4)</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeResumeHeist}
                className={`flex-1 sm:flex-initial px-4 py-2 sm:py-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                  isDark
                    ? 'border-blue-900/40 text-slate-300 hover:bg-[#132238]'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Close
              </button>

              <a
                href="/Abhay_Gupta_Resume.pdf"
                download="Abhay_Gupta_Resume.pdf"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition active:scale-95 text-center"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Download Now</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
