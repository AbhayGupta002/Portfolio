import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, MapPin, Phone, Edit3, ArrowUp, Send } from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';

export const Footer: React.FC = () => {
  const { profile, isAdminMode, openAdminModal } = usePortfolioData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="scroll-mt-20 px-3.5 pb-10 pt-8 sm:px-6 sm:pt-14 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-blue-900/50 bg-white/85 dark:bg-[#0B1528]/90 backdrop-blur-xl px-4 py-6 sm:px-10 sm:py-12 text-slate-900 dark:text-white shadow-sm dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition-colors hover:border-blue-400/60 dark:hover:border-cyan-500/40"
      >
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Span (7 cols on laptop) */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="section-kicker font-mono mb-0">
                <Send className="h-3.5 w-3.5" /> Get in touch
              </span>
              {isAdminMode && (
                <button
                  type="button"
                  onClick={() => openAdminModal('profile')}
                  className="inline-flex items-center gap-1 text-xs font-mono text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" /> Edit Contact Info
                </button>
              )}
            </div>

            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Let’s build something meaningful.
            </h2>
            <p className="mt-2 sm:mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {profile.summary}
            </p>

            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
              <motion.a
                href={`mailto:${profile.email}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Mail className="h-4 w-4" /> Email me <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
              <motion.a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 dark:border-blue-900/50 bg-slate-50 dark:bg-[#0E1A30] px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-mono font-medium text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-cyan-400 hover:text-blue-600 dark:hover:text-cyan-300 transition-all cursor-pointer"
                title="LinkedIn Profile (Opens in new tab)"
              >
                <LinkedinIcon className="h-4 w-4" /> LinkedIn
              </motion.a>
              <motion.a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 dark:border-blue-900/50 bg-slate-50 dark:bg-[#0E1A30] px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-mono font-medium text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-cyan-400 hover:text-blue-600 dark:hover:text-cyan-300 transition-all cursor-pointer"
                title="GitHub Profile (Opens in new tab)"
              >
                <GithubIcon className="h-4 w-4" /> GitHub
              </motion.a>
            </div>
          </div>

          {/* Right Span (5 cols on laptop): Adaptive Contact Glass Pills */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-blue-900/40 bg-slate-50/70 dark:bg-[#0E1A30]/70 hover:border-blue-400 dark:hover:border-cyan-400/60 hover:shadow-sm transition-all"
            >
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400">
                <Mail className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Email
                </span>
                <span className="block text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                  {profile.email}
                </span>
              </div>
            </a>

            <a
              href={`tel:${profile.phone}`}
              className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-blue-900/40 bg-slate-50/70 dark:bg-[#0E1A30]/70 hover:border-blue-400 dark:hover:border-cyan-400/60 hover:shadow-sm transition-all"
            >
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400">
                <Phone className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Phone
                </span>
                <span className="block text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                  {profile.phone}
                </span>
              </div>
            </a>

            <div className="sm:col-span-2 lg:col-span-1 flex items-center gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-blue-900/40 bg-slate-50/70 dark:bg-[#0E1A30]/70">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400">
                <MapPin className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Location
                </span>
                <span className="block text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                  {profile.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-slate-200/80 dark:border-blue-900/40 flex flex-col gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.name} · All rights reserved.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="w-fit inline-flex items-center gap-1.5 text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
          >
            Back to top <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </footer>
  );
};

