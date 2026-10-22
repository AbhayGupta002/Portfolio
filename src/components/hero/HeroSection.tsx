import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  MapPin,
  Terminal,
  CheckCircle2,
  Edit3,
  Sparkles,
  Sliders,
  X,
  Maximize2,
  Check,
  RotateCcw,
  Upload,
  Trash2,
} from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import { findProfessionByLabel } from '../../data/professionTaxonomy';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export const HeroSection: React.FC = () => {
  const {
    profile,
    updateProfile,
    experiences,
    education,
    isAdminMode,
    openAdminModal,
    openResumeHeist,
  } = usePortfolioData();

  const taxItem = findProfessionByLabel(profile.profession);

  const dynamicEducationSummary = education.length > 0
    ? education.map(e => e.degree.split('(')[0].trim()).join(' · ')
    : (profile.educationSummary || 'Add Education Details');

  const dynamicInternshipsSummary = experiences.length > 0
    ? experiences.map(e => e.company.split(' ')[0]).join(' · ')
    : (profile.internshipsSummary || 'Add Experience Details');

  const isIT = !profile.profession || profile.profession.toLowerCase().includes('information technology') || profile.profession.toLowerCase().includes('(it)');
  const attr1Label = isIT ? 'Backend Tech' : taxItem.defaultAttributes.attr1Label;
  const attr1Val = profile.backendTech || taxItem.defaultAttributes.attr1Default;

  const attr2Label = isIT ? 'Frontend Tech' : taxItem.defaultAttributes.attr2Label;
  const attr2Val = profile.frontendTech || taxItem.defaultAttributes.attr2Default;

  const attr3Label = isIT ? 'Databases' : taxItem.defaultAttributes.attr3Label;
  const attr3Val = profile.databases || taxItem.defaultAttributes.attr3Default;

  // Profile Photo Lightbox Modal state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  useBodyScrollLock(isPhotoModalOpen);

  const getPhotoSrc = () => {
    if (typeof profile.avatarUrl === 'string') {
      return profile.avatarUrl;
    }
    return '/abhay-profile-smooth.jpg';
  };

  return (
    <section id="about" className="relative overflow-hidden px-4 pb-12 pt-24 sm:px-6 sm:pb-20 sm:pt-32">
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-3xl transition-colors duration-500" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 dark:bg-cyan-500/10 blur-3xl transition-colors duration-500" />

      <div className="relative mx-auto max-w-6xl">
        {/* Admin Mode Section Edit Pill */}
        {isAdminMode && (
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => openAdminModal('profile')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Hero & Profile
            </button>
          </div>
        )}

        {/* Unified Adaptive Glass Bento Container (Rearranges from 12-col laptop split to clean mobile view) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Span (7 cols on laptop): Identity, Headline & Horizontal Quick-Stats */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-blue-900/40 bg-white/80 dark:bg-[#0B1528]/80 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-sm dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-colors">
            <div>
              {/* Top Row: Status Pill & Role Tag */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                <span
                  onClick={() => isAdminMode && openAdminModal('profile')}
                  className={`inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-blue-800/60 bg-slate-50/90 dark:bg-[#0E1A30] px-3.5 py-1.5 text-xs font-mono font-medium text-slate-700 dark:text-cyan-300 transition-colors ${
                    isAdminMode ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {profile.statusMessage}
                  {isAdminMode && <Edit3 className="w-3 h-3 text-blue-500 ml-1" />}
                </span>

                <span
                  onClick={() => isAdminMode && openAdminModal('profile')}
                  className={`text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-cyan-400 ${
                    isAdminMode ? 'cursor-pointer hover:underline' : ''
                  }`}
                >
                  {profile.title}
                </span>
              </div>

              {/* Primary Headline (Font Type 1: Clean Sans Bold) */}
              <h1
                onClick={() => isAdminMode && openAdminModal('profile')}
                className={`text-2xl sm:text-4xl lg:text-5xl font-bold leading-[1.12] tracking-tight text-slate-900 dark:text-white transition-colors ${
                  isAdminMode ? 'cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-950/30 p-1 -ml-1 rounded-xl' : ''
                }`}
              >
                {profile.headline || 'Building end-to-end applications with Java & React.'}
                {isAdminMode && <Edit3 className="inline w-4 h-4 text-blue-500 ml-2" />}
              </h1>

              {/* Bio Copy (Font Type 1: Clean Sans Regular) */}
              <p
                onClick={() => isAdminMode && openAdminModal('profile')}
                className={`mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 transition-colors ${
                  isAdminMode ? 'cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-950/30 p-2 -ml-2 rounded-xl' : ''
                }`}
              >
                {profile.bio}
                {isAdminMode && <Edit3 className="inline w-3.5 h-3.5 text-blue-500 ml-1" />}
              </p>

              {/* Horizontal Scrollable Skill Spans (Adaptive on Mobile & Desktop) */}
              <div className="mt-6">
                <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                  Core Stack Spans
                </span>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {(profile.primarySkills || ['Java 17', 'Spring Boot 3', 'React', 'MySQL', 'REST APIs', 'JWT']).map(
                    (skill) => (
                      <span
                        key={skill}
                        className="shrink-0 rounded-xl border border-slate-200/90 dark:border-blue-800/50 bg-slate-50/90 dark:bg-[#101D33]/90 px-3 py-1.5 text-xs font-mono font-medium text-slate-700 dark:text-cyan-300 shadow-2xs"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions & Social Strip */}
            <div className="mt-7 pt-5 border-t border-slate-200/70 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="#architecture-blueprint"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-500 shadow-sm"
                >
                  Explore Blueprint <ArrowDownRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={openResumeHeist}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-blue-800/70 bg-white dark:bg-[#0E1A30] px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 transition hover:border-blue-500 dark:hover:border-cyan-400 cursor-pointer active:scale-95"
                >
                  <Download className="h-4 w-4 text-blue-600 dark:text-cyan-400" /> Résumé
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400">
                <span
                  onClick={() => isAdminMode && openAdminModal('profile')}
                  className={`inline-flex items-center gap-1 ${
                    isAdminMode ? 'cursor-pointer hover:underline' : ''
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                  <span className="truncate max-w-[130px]">{profile.location}</span>
                </span>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-cyan-400 transition"
                >
                  <LinkedinIcon className="h-3.5 w-3.5" /> LinkedIn
                </a>
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-cyan-400 transition"
                >
                  <GithubIcon className="h-3.5 w-3.5" /> GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Right Span (5 cols on laptop): Glass Snapshot Card with 2x2 Bento Grid instead of long vertical list */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-blue-900/50 bg-white/85 dark:bg-[#0B1528]/90 backdrop-blur-xl p-6 sm:p-7 shadow-sm dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-colors">
            <div>
              {/* Admin Quick Edit Header */}
              {isAdminMode && (
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-blue-900/40">
                  <span className="text-[11px] font-mono text-blue-600 dark:text-cyan-400 flex items-center gap-1">
                    <Edit3 className="w-3 h-3" /> Glass Snapshot Card
                  </span>
                  <button
                    type="button"
                    onClick={() => openAdminModal('snapshot')}
                    className="text-[11px] font-mono font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                  >
                    Edit Fields →
                  </button>
                </div>
              )}

              {/* Profile Header Card */}
              <div className="flex items-center gap-4 p-3 rounded-2xl border border-slate-200/70 dark:border-blue-900/40 bg-slate-50/70 dark:bg-[#0E1A30]/70">
                <div
                  className="relative shrink-0 cursor-pointer group"
                  onClick={() => setIsPhotoModalOpen(true)}
                  title="Click to view profile photo"
                >
                  <div className="relative h-20 w-20 sm:h-22 sm:w-22 overflow-hidden rounded-2xl border-2 border-white dark:border-cyan-500/40 shadow-md transition-transform duration-300 group-hover:scale-105 bg-[#071120] flex items-center justify-center">
                    {getPhotoSrc() ? (
                      <>
                        <img
                          src={getPhotoSrc()}
                          alt={profile.name}
                          className="h-full w-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-4 h-4 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-cyan-400 font-mono">
                        <span className="text-xl font-bold">
                          {profile.name ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'AG'}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5" title="Available for Hire">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-[#0B1528]" />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                        {profile.name}
                      </h2>
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                    </div>
                    <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-300 border border-blue-500/20">
                      {profile.snapshotBadge || 'VERIFIED'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">
                    {profile.targetRole || profile.title}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Available for Hire
                    </span>
                  </div>
                </div>
              </div>

              {/* 2-Column Adaptive Glass Span Grid (Replaces serial vertical list) */}
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {[
                  [attr1Label, attr1Val],
                  [attr2Label, attr2Val],
                  [attr3Label, attr3Val],
                  ['Experience', profile.internshipsSummary || dynamicInternshipsSummary],
                  ['Education', profile.educationSummary || dynamicEducationSummary],
                  ['Role Focus', profile.snapshotFocus || `${taxItem.label.split('(')[0].trim()} Focus`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    onClick={() => isAdminMode && openAdminModal('snapshot')}
                    className={`p-3 rounded-2xl border border-slate-200/70 dark:border-blue-900/40 bg-slate-50/60 dark:bg-[#0E1A30]/50 flex flex-col justify-between transition-all ${
                      isAdminMode ? 'cursor-pointer hover:border-blue-400' : ''
                    }`}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                      {label}
                    </span>
                    <span className="mt-1 text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Footer Strip */}
            <div
              onClick={() => isAdminMode && openAdminModal('snapshot')}
              className={`mt-4 pt-3 border-t border-slate-200/70 dark:border-blue-900/40 flex items-center justify-between text-xs ${
                isAdminMode ? 'cursor-pointer hover:opacity-80' : ''
              }`}
            >
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{profile.workType || 'Full-Time Opportunities'}</span>
              </span>
              <span className="font-mono text-blue-600 dark:text-cyan-400 font-medium truncate">
                {profile.locationPreference || profile.location || 'Indore, MP / Remote'}
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* Clean Profile Photo Lightbox Modal - Only displays profile photo */}
      {isPhotoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-3xl border border-slate-700/60 bg-[#0B1528] text-white shadow-2xl p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-blue-900/40 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                  {profile.name}
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {profile.targetRole || profile.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
                aria-label="Close profile photo"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Clean Full Portrait Display */}
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl border border-blue-500/30 shadow-xl bg-[#071120] flex items-center justify-center">
              {getPhotoSrc() ? (
                <img
                  src={getPhotoSrc()}
                  alt={profile.name}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-cyan-400 font-mono">
                  <span className="text-5xl font-bold">
                    {profile.name ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'AG'}
                  </span>
                  <span className="text-xs text-slate-400 mt-2">No Photo Set</span>
                </div>
              )}
            </div>

            {/* Bottom info strip */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-blue-900/40">
              <span className="font-mono text-cyan-400">{profile.locationPreference || profile.location || 'Indore, MP / Remote'}</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Available for Hire
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
