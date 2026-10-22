import React, { useState, useRef } from 'react';
import {
  ArrowUpRight,
  ExternalLink,
  FolderKanban,
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { GithubIcon } from '../common/BrandIcons';

export const ProjectsSection: React.FC = () => {
  const { projects, isAdminMode, openAdminModal, setEditingProjectId, deleteProject, profile } = usePortfolioData();
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollSlide = (dir: 'prev' | 'next') => {
    if (!carouselRef.current || projects.length === 0) return;
    const nextIdx =
      dir === 'next'
        ? (activeSlide + 1) % projects.length
        : (activeSlide - 1 + projects.length) % projects.length;
    setActiveSlide(nextIdx);
    const child = carouselRef.current.children[nextIdx] as HTMLElement | undefined;
    if (child) {
      carouselRef.current.scrollTo({ left: child.offsetLeft - 16, behavior: 'smooth' });
    }
  };

  return (
    <section id="projects" className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-22 transition-colors">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="section-kicker font-mono">
              <FolderKanban className="h-4 w-4" /> Selected Work
            </span>
            <h2 className="section-title">Projects made to solve real problems.</h2>
            <p className="section-copy">
              Full-stack applications built with clean backend architecture and responsive user interfaces.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
            {/* Mobile Slide Controls */}
            {projects.length > 1 && (
              <div className="flex md:hidden items-center gap-1.5 rounded-2xl border border-slate-200/80 dark:border-blue-900/50 bg-white/80 dark:bg-[#0B1528]/80 backdrop-blur-md p-1">
                <button
                  type="button"
                  onClick={() => scrollSlide('prev')}
                  className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#101D33]"
                  aria-label="Previous project slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono text-xs font-semibold text-blue-600 dark:text-cyan-400">
                  0{activeSlide + 1} / 0{projects.length}
                </span>
                <button
                  type="button"
                  onClick={() => scrollSlide('next')}
                  className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#101D33]"
                  aria-label="Next project slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {isAdminMode && (
              <button
                type="button"
                onClick={() => {
                  setEditingProjectId(null);
                  openAdminModal('projects');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            )}

            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 dark:border-blue-900/50 bg-white/80 dark:bg-[#0B1528]/80 backdrop-blur-md px-3.5 py-2 text-xs font-mono font-semibold text-blue-600 dark:text-cyan-400 hover:border-blue-400 transition"
            >
              GitHub <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="py-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-blue-900/50 bg-white/60 dark:bg-[#0B1528]/60 backdrop-blur-xl p-8">
            <FolderKanban className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-60" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No projects added yet.
            </p>
            {isAdminMode && (
              <button
                type="button"
                onClick={() => {
                  setEditingProjectId(null);
                  openAdminModal('projects');
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add First Project
              </button>
            )}
          </div>
        ) : (
          /* Single Adaptive Container: Horizontal Snap Book Slides on Mobile -> Bento Span Grid on Laptop */
          <div>
            <div
              ref={carouselRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                const idx = Math.round(el.scrollLeft / (el.clientWidth * 0.85));
                if (idx >= 0 && idx < projects.length && idx !== activeSlide) {
                  setActiveSlide(idx);
                }
              }}
              className="flex md:grid md:grid-cols-12 overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-4 sm:gap-5 no-scrollbar pb-2"
            >
              {projects.map((project, index) => {
                // Featured first card spans 7 columns on desktop, second spans 5, and alternates cleanly
                const spanClass =
                  projects.length === 1
                    ? 'md:col-span-12'
                    : index % 3 === 0
                    ? 'md:col-span-7'
                    : index % 3 === 1
                    ? 'md:col-span-5'
                    : 'md:col-span-6';

                return (
                  <article
                    key={project.id}
                    className={`snap-center shrink-0 w-[86vw] sm:w-[75vw] md:w-auto ${spanClass} group flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-blue-900/40 bg-white/85 dark:bg-[#0B1528]/85 backdrop-blur-xl p-6 sm:p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-400 dark:hover:border-cyan-500/50 shadow-sm hover:shadow-md dark:shadow-[0_14px_34px_rgba(0,0,0,0.35)] ${
                      isAdminMode ? 'ring-1 ring-blue-500/20' : ''
                    }`}
                  >
                    <div>
                      {/* Card Top Bar */}
                      <div className="mb-4 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#101D33] font-mono text-xs font-semibold text-blue-600 dark:text-cyan-400">
                          0{index + 1}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-blue-500/10 px-3 py-1 font-mono text-[11px] font-medium text-blue-600 dark:text-cyan-300 border border-blue-500/20">
                            {project.category}
                          </span>

                          {isAdminMode && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProjectId(project.id);
                                  openAdminModal('projects');
                                }}
                                className="p-1.5 rounded-lg text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer"
                                title="Edit project"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Delete project "${project.title}"?`)) {
                                    deleteProject(project.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
                                title="Delete project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-xs font-mono font-medium text-blue-600 dark:text-cyan-400">
                        {project.subtitle}
                      </p>

                      {/* Description */}
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {project.description}
                      </p>

                      {/* Impact Metric Badge */}
                      {project.metrics && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{project.metrics}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer: Tech Spans & Links */}
                    <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-blue-900/40">
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="shrink-0 rounded-lg bg-slate-100/90 dark:bg-[#101D33] px-2.5 py-1 text-[11px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-blue-900/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-4 text-xs font-semibold">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition"
                        >
                          <GithubIcon className="h-4 w-4" /> Source Code
                        </a>

                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 dark:text-cyan-400 hover:underline"
                          >
                            Live Demo <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Mobile Dot Indicators */}
            {projects.length > 1 && (
              <div className="mt-3 flex md:hidden justify-center gap-1.5">
                {projects.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setActiveSlide(idx);
                      const child = carouselRef.current?.children[idx] as HTMLElement | undefined;
                      if (child && carouselRef.current) {
                        carouselRef.current.scrollTo({ left: child.offsetLeft - 16, behavior: 'smooth' });
                      }
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeSlide
                        ? 'w-6 bg-blue-600 dark:bg-cyan-400'
                        : 'w-1.5 bg-slate-300 dark:bg-blue-900/60'
                    }`}
                    aria-label={`Go to project ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

