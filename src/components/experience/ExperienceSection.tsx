import React, { useState, useRef } from 'react';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  MapPin,
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';

export const ExperienceSection: React.FC = () => {
  const { experiences, isAdminMode, openAdminModal, setEditingExperienceId, deleteExperience } = usePortfolioData();
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileSlideRef = useRef<HTMLDivElement>(null);

  const safeIndex = experiences.length > 0 ? Math.min(activeIndex, experiences.length - 1) : 0;
  const activeExp = experiences[safeIndex];

  const handlePrev = () => {
    const next = safeIndex > 0 ? safeIndex - 1 : experiences.length - 1;
    setActiveIndex(next);
    scrollToSlide(next);
  };

  const handleNext = () => {
    const next = safeIndex < experiences.length - 1 ? safeIndex + 1 : 0;
    setActiveIndex(next);
    scrollToSlide(next);
  };

  const scrollToSlide = (idx: number) => {
    if (mobileSlideRef.current) {
      const container = mobileSlideRef.current;
      const child = container.children[idx] as HTMLElement | undefined;
      if (child) {
        container.scrollTo({ left: child.offsetLeft - 16, behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="experience" className="section-wash scroll-mt-20 px-4 py-14 sm:px-6 sm:py-22 transition-colors">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="section-kicker font-mono">
              <BriefcaseBusiness className="h-4 w-4" /> Career Chapters
            </span>
            <h2 className="section-title">Learning by building with teams.</h2>
            <p className="section-copy">
              Flip through my engineering roles and internship chapters across backend and full-stack product teams.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {experiences.length > 1 && (
              <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200/80 dark:border-blue-900/50 bg-white/80 dark:bg-[#0B1528]/80 backdrop-blur-md p-1.5 shadow-2xs">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#101D33] transition cursor-pointer"
                  aria-label="Previous experience chapter"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono text-xs font-semibold text-blue-600 dark:text-cyan-400">
                  0{safeIndex + 1} / 0{experiences.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#101D33] transition cursor-pointer"
                  aria-label="Next experience chapter"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {isAdminMode && (
              <button
                type="button"
                onClick={() => {
                  setEditingExperienceId(null);
                  openAdminModal('experience');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Role
              </button>
            )}
          </div>
        </div>

        {experiences.length === 0 ? (
          <div className="py-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-blue-900/50 bg-white/60 dark:bg-[#0B1528]/60 backdrop-blur-xl p-8">
            <BriefcaseBusiness className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-60" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No work experience entries recorded yet.
            </p>
            {isAdminMode && (
              <button
                type="button"
                onClick={() => {
                  setEditingExperienceId(null);
                  openAdminModal('experience');
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add First Experience
              </button>
            )}
          </div>
        ) : (
          /* Single Adaptive Container: Book Spread on Laptop & Horizontal Book Slide on Mobile */
          <div className="rounded-3xl border border-slate-200/90 dark:border-blue-900/50 bg-white/85 dark:bg-[#0B1528]/90 backdrop-blur-xl shadow-sm dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] overflow-hidden transition-colors">
            {/* Top Chapter Selector Tabs (Horizontal Scrollable Spans on Mobile & Laptop) */}
            <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3.5 border-b border-slate-200/80 dark:border-blue-900/40 bg-slate-50/80 dark:bg-[#081120]/80 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2">
                {experiences.map((exp, idx) => {
                  const isSelected = idx === safeIndex;
                  return (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => {
                        setActiveIndex(idx);
                        scrollToSlide(idx);
                      }}
                      className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'bg-white/80 dark:bg-[#0E1A30] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-blue-900/40 hover:border-blue-400'
                      }`}
                    >
                      <span className={isSelected ? 'text-blue-100' : 'text-blue-600 dark:text-cyan-400'}>
                        0{idx + 1}
                      </span>
                      <span className="font-sans font-semibold truncate max-w-[150px] sm:max-w-[200px]">
                        {exp.company}
                      </span>
                    </button>
                  );
                })}
              </div>

              <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                Interactive Book Slide
              </span>
            </div>

            {/* Laptop / Tablet Open Book 2-Page Spread (12-column adaptive grid) */}
            {activeExp && (
              <div className="hidden sm:grid sm:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:divide-blue-900/40">
                {/* Left Book Page (4 cols): Role Identity, Timeline, Location & Tech Spans */}
                <div className="sm:col-span-4 p-6 lg:p-8 flex flex-col justify-between bg-slate-50/40 dark:bg-[#091324]/50">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400 font-mono text-xs font-semibold">
                        CHAPTER 0{safeIndex + 1}
                      </span>
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {activeExp.period}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {activeExp.role}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-blue-600 dark:text-cyan-400">
                      {activeExp.company}
                    </p>

                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                      {activeExp.location}
                    </span>

                    {/* Tech Stack Spans */}
                    <div className="mt-6">
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                        Technologies Used
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeExp.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-lg bg-white dark:bg-[#101D33] px-2.5 py-1 text-xs font-mono text-slate-700 dark:text-cyan-300 border border-slate-200/90 dark:border-blue-900/50"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {isAdminMode && (
                    <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-blue-900/40 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingExperienceId(activeExp.id);
                          openAdminModal('experience');
                        }}
                        className="px-3 py-1.5 rounded-xl border border-blue-500/40 text-blue-600 dark:text-cyan-400 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Role
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete experience at ${activeExp.company}?`)) {
                            deleteExperience(activeExp.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl border border-red-500/40 text-red-500 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Book Page (8 cols): Key Contributions & Impact Cards */}
                <div className="sm:col-span-8 p-6 lg:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-cyan-400 font-semibold">
                      Key Engineering Contributions & Impact
                    </span>

                    <div className="mt-4 grid grid-cols-1 gap-3">
                      {activeExp.highlights.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl border border-slate-200/70 dark:border-blue-900/40 bg-slate-50/60 dark:bg-[#0E1A30]/60 flex items-start gap-3 transition-colors"
                        >
                          <span className="mt-0.5 shrink-0 font-mono text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                            0{idx + 1}
                          </span>
                          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-blue-900/30 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400 dark:text-slate-500">
                      Page 0{safeIndex + 1} of 0{experiences.length}
                    </span>
                    <a
                      href="#projects"
                      className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                    >
                      Explore Projects <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Horizontal Snap Book Slides (Swipeable Cards on Phone Screens) */}
            <div
              ref={mobileSlideRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                const idx = Math.round(el.scrollLeft / (el.clientWidth * 0.85));
                if (idx >= 0 && idx < experiences.length && idx !== activeIndex) {
                  setActiveIndex(idx);
                }
              }}
              className="flex sm:hidden overflow-x-auto snap-x snap-mandatory gap-4 p-4 no-scrollbar"
            >
              {experiences.map((exp, idx) => (
                <article
                  key={exp.id}
                  className="snap-center shrink-0 w-[88vw] max-w-[360px] rounded-2xl border border-slate-200/90 dark:border-blue-900/50 bg-slate-50/70 dark:bg-[#0E1A30]/70 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-cyan-400 font-mono text-[11px] font-semibold">
                        0{idx + 1} / 0{experiences.length}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {exp.period}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {exp.role}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 dark:text-cyan-400 mt-0.5">
                      {exp.company} · {exp.location}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {exp.highlights.map((item, i) => (
                        <li key={i} className="flex gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-cyan-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-blue-900/40">
                    <div className="flex flex-wrap gap-1.5">
                      {exp.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg bg-white dark:bg-[#101D33] px-2 py-0.5 text-[11px] font-mono text-slate-700 dark:text-cyan-300 border border-slate-200 dark:border-blue-900/40"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

