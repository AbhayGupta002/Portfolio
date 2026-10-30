import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, MapPin, Edit3, BookMarked } from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';

export const EducationSection: React.FC = () => {
  const { education, certifications, isAdminMode, openAdminModal } = usePortfolioData();
  const [mobilePane, setMobilePane] = useState<'academic' | 'certs'>('academic');

  return (
    <section id="education" className="section-wash scroll-mt-20 px-3.5 py-10 sm:px-6 sm:py-18 transition-colors">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-6 sm:mb-10 flex flex-col justify-between gap-3.5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="section-kicker font-mono">
              <GraduationCap className="h-4 w-4" /> Credentials & Academics
            </span>
            <h2 className="section-title">A strong foundation, still growing.</h2>
            <p className="section-copy">
              Academic degrees, engineering workshops, and hackathons arranged in a unified credential book.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            {/* Mobile Book Tab Switcher */}
            <div className="flex lg:hidden rounded-2xl border border-slate-200/80 dark:border-blue-900/50 bg-white/80 dark:bg-[#0B1528]/80 backdrop-blur-md p-1">
              <button
                type="button"
                onClick={() => setMobilePane('academic')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer ${
                  mobilePane === 'academic'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Degrees ({education.length})
              </button>
              <button
                type="button"
                onClick={() => setMobilePane('certs')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer ${
                  mobilePane === 'certs'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Certs ({certifications.length})
              </button>
            </div>

            {isAdminMode && (
              <button
                type="button"
                onClick={() => openAdminModal('education')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                <Edit3 className="w-4 h-4" /> Edit Credentials
              </button>
            )}
          </div>
        </div>

        {/* Single Unified Glass Credential Book */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-blue-900/50 bg-white/85 dark:bg-[#0B1528]/90 backdrop-blur-xl shadow-sm dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden transition-all hover:border-blue-400/60 dark:hover:border-cyan-500/40"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 dark:divide-blue-900/40">
            {/* Left Page (6 cols on laptop): Academic Degrees */}
            <div
              className={`lg:col-span-6 p-4 sm:p-6 lg:p-8 ${
                mobilePane === 'academic' ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                  <GraduationCap className="h-4 w-4" /> Academic Degrees
                </span>
                <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                  PAGE 01
                </span>
              </div>

              {education.length === 0 ? (
                <div className="py-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-blue-900/50 p-6">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    No academic qualifications added yet.
                  </p>
                </div>
              ) : (
                <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible snap-x snap-mandatory gap-3.5 sm:gap-4 no-scrollbar pb-1">
                  {education.map((edu, idx) => (
                    <article
                      key={idx}
                      className="snap-center shrink-0 w-[84vw] sm:w-[70vw] lg:w-auto rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-blue-900/40 bg-slate-50/70 dark:bg-[#0E1A30]/70 p-3.5 sm:p-5 transition hover:border-blue-400 dark:hover:border-cyan-500/40 hover:-translate-y-0.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400 font-mono text-xs font-semibold">
                          {edu.period}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-700 dark:text-slate-300 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                          {edu.location}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {edu.degree}
                      </h3>
                      <p className="mt-0.5 text-xs sm:text-sm font-semibold text-blue-700 dark:text-cyan-400">
                        {edu.institution}
                      </p>

                      {edu.details && (
                        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                          {edu.details}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Right Page (6 cols on laptop): Workshops, Hackathons & Recognition */}
            <div
              className={`lg:col-span-6 p-4 sm:p-6 lg:p-8 bg-slate-50/30 dark:bg-[#091324]/40 ${
                mobilePane === 'certs' ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                  <Award className="h-4 w-4" /> Workshops & Recognition
                </span>
                <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                  PAGE 02
                </span>
              </div>

              {certifications.length === 0 ? (
                <div className="py-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-blue-900/50 p-6">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    No certifications or workshops added yet.
                  </p>
                </div>
              ) : (
                <div className="flex lg:grid lg:grid-cols-1 overflow-x-auto lg:overflow-visible snap-x snap-mandatory gap-3 sm:gap-3.5 no-scrollbar pb-1">
                  {certifications.map((cert, idx) => (
                    <article
                      key={idx}
                      className="snap-center shrink-0 w-[84vw] sm:w-[70vw] lg:w-auto rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-blue-900/40 bg-white/90 dark:bg-[#0E1A30]/80 p-3.5 sm:p-5 transition hover:border-blue-400 dark:hover:border-cyan-500/40 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {cert.issuer}
                          {cert.badge ? ` · ${cert.badge}` : ''}
                        </span>
                        {cert.year && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#101D33] font-mono text-xs text-slate-600 dark:text-slate-300">
                            {cert.year}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {cert.title}
                      </h3>
                      <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                        {cert.description}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

