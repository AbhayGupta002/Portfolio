import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  X,
  Maximize2,
  Database,
  Layers,
  Code2,
  CheckCircle2,
  ArrowRight,
  Shield,
  Coffee,
  Table,
  Zap,
  Terminal,
  Download,
  Server,
  Box,
  Cpu,
  GitBranch,
} from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { useTheme } from '../../context/ThemeContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

interface Chapter {
  id: string;
  badge: string;
  tabTitle: string;
  headline: string;
  subtitle: string;
  durationMs: number; // Duration of this slide in milliseconds
}

const CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    badge: '01 / OVERVIEW',
    tabTitle: 'Overview',
    headline: 'Java Backend Journey — Abhay Gupta',
    subtitle: 'Architecting scalable, production-grade distributed backend applications with Java 17 and Spring Boot 3.',
    durationMs: 7000,
  },
  {
    id: 'java-core',
    badge: '02 / CORE RUNTIME',
    tabTitle: 'Java Core',
    headline: 'Java Core Topics & Concurrency Foundations',
    subtitle: 'Mastering the JVM runtime, memory layout, Collections framework, and multi-threaded concurrency.',
    durationMs: 9500,
  },
  {
    id: 'mvc-monolith',
    badge: '03 / SYSTEM DESIGN',
    tabTitle: 'MVC & Monolith',
    headline: 'Spring MVC & Monolithic Architecture',
    subtitle: 'Clean request lifecycle, decoupled layered boundaries, and high-performance monolithic deployment.',
    durationMs: 9500,
  },
  {
    id: 'orm-jpa',
    badge: '04 / DATA PERSISTENCE',
    tabTitle: 'ORM & Architecture',
    headline: 'ORM (Object-Relational Mapping): Hibernate and JPA',
    subtitle: 'Hibernate and JPA for mapping Java objects directly to database tables.',
    durationMs: 11000,
  },
  {
    id: 'production',
    badge: '05 / CLOUD & IMPACT',
    tabTitle: 'Production',
    headline: 'Production Engineering & Cloud Delivery',
    subtitle: 'High-throughput query tuning, containerized delivery, and rigorous interview readiness.',
    durationMs: 8000,
  },
];

export const OneShotViewModal: React.FC = () => {
  const { isOneShotOpen, closeOneShot, openResumeHeist } = usePortfolioData();
  const { isDark } = useTheme();

  // Prevent background scroll while modal is active
  useBodyScrollLock(isOneShotOpen);

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100 for current chapter
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.75, 1, 1.5
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeEntityTab, setActiveEntityTab] = useState<'UserAccount' | 'PortfolioData' | 'PortfolioRepository'>('UserAccount');

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const currentChapter = CHAPTERS[currentChapterIndex];

  // Reset to chapter 0 on modal open
  useEffect(() => {
    if (isOneShotOpen) {
      setCurrentChapterIndex(0);
      setProgress(0);
      setIsPlaying(true);
      lastTimeRef.current = null;
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isOneShotOpen]);

  // Keyboard navigation & Fullscreen change detection
  useEffect(() => {
    if (!isOneShotOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeOneShot();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isOneShotOpen, currentChapterIndex]);

  // Video-like timer ticker using requestAnimationFrame for 60fps buttery smooth progress
  useEffect(() => {
    if (!isOneShotOpen || !isPlaying) {
      lastTimeRef.current = null;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const duration = currentChapter.durationMs / playbackSpeed;

    const step = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      setProgress((prev) => {
        const next = prev + (delta / duration) * 100;
        if (next >= 100) {
          // Chapter finished -> advance or loop
          if (currentChapterIndex < CHAPTERS.length - 1) {
            setCurrentChapterIndex((c) => c + 1);
            return 0;
          } else {
            // End of journey -> pause on last chapter
            setIsPlaying(false);
            return 100;
          }
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isOneShotOpen, isPlaying, currentChapterIndex, playbackSpeed, currentChapter.durationMs]);

  const handleNext = () => {
    if (currentChapterIndex < CHAPTERS.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
      setProgress(0);
      lastTimeRef.current = null;
    }
  };

  const handlePrev = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
      setProgress(0);
      lastTimeRef.current = null;
    }
  };

  const jumpToChapter = (idx: number) => {
    setCurrentChapterIndex(idx);
    setProgress(0);
    lastTimeRef.current = null;
    setIsPlaying(true);
  };

  const handleRestart = () => {
    setCurrentChapterIndex(0);
    setProgress(0);
    lastTimeRef.current = null;
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (!isOneShotOpen) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden select-none transition-colors duration-500 ${
        isDark
          ? 'bg-[#050A14]/95 text-white'
          : 'bg-[#F8FAFD]/95 text-[#0F172A]'
      } backdrop-blur-3xl`}
      style={{
        height: '100dvh',
      }}
    >
      {/* Dynamic Ambient Background Lights */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full blur-[140px] transition-all duration-1000 ${
            currentChapterIndex === 0
              ? 'bg-blue-600/25'
              : currentChapterIndex === 1
              ? 'bg-amber-500/20'
              : currentChapterIndex === 2
              ? 'bg-emerald-500/25'
              : currentChapterIndex === 3
              ? 'bg-cyan-500/25'
              : 'bg-purple-600/25'
          }`}
        />
        <div className="absolute -bottom-20 right-10 h-[400px] w-[400px] rounded-full bg-blue-500/15 blur-[120px]" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP MAC-STYLE HEADER BAR & VIDEO SEGMENTED TIMELINE                    */}
      {/* ========================================================================= */}
      <header className={`relative z-20 w-full border-b backdrop-blur-xl px-4 py-3 sm:px-6 sm:py-3.5 transition-colors ${
        isDark ? 'border-blue-900/40 bg-[#070F1E]/80' : 'border-slate-200/90 bg-white/85 shadow-xs'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Mac-Style Window Traffic Light Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeOneShot}
              className="group relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FF5F56] border border-[#E0443E] transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title="Close Tour (ESC)"
              aria-label="Close"
            >
              <X className="h-2 w-2 text-[#4A0002] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="group relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FFBD2E] border border-[#DEA123] transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label="Pause or Play"
            >
              <span className="h-1 w-1 rounded-full bg-[#5C3C00] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="group relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#27C93F] border border-[#1AAB29] transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
              aria-label="Toggle Fullscreen"
            >
              <Maximize2 className="h-1.5 w-1.5 text-[#004D11] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Central Title Tag (Engineering Clean - No AI Sparkles) */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl border border-slate-200/80 dark:border-blue-800/50 bg-slate-100/70 dark:bg-[#0E1A30]/80 text-xs font-mono">
            <Terminal className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
            <span className="font-semibold text-slate-800 dark:text-cyan-300">
              Java Backend Journey — Abhay Gupta
            </span>
            <span className="mx-1 text-slate-400">•</span>
            <span className={`inline-flex items-center gap-1 font-bold ${isPlaying ? 'text-emerald-500' : 'text-amber-500'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
              {isPlaying ? 'PLAYING' : 'PAUSED'}
            </span>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-blue-900/60 bg-slate-100/80 dark:bg-[#0E1A30] p-0.5 text-[11px] font-mono">
              {[0.75, 1, 1.5].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Quick Close Button */}
            <button
              type="button"
              onClick={closeOneShot}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-blue-900/60 bg-slate-100/80 dark:bg-[#0E1A30] text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/40 transition-all cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden md:inline">ESC</span>
            </button>
          </div>
        </div>

        {/* Video Segmented Progress Bar (5 story segments filling smoothly) */}
        <div className="mx-auto mt-3 max-w-7xl">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
            {CHAPTERS.map((ch, idx) => {
              const isPast = idx < currentChapterIndex;
              const isCurrent = idx === currentChapterIndex;
              const segProgress = isPast ? 100 : isCurrent ? progress : 0;

              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => jumpToChapter(idx)}
                  className="group flex flex-col gap-1 text-left cursor-pointer"
                  title={`Jump to ${ch.tabTitle}`}
                >
                  {/* Neon Bar Track */}
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800/80">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-75"
                      style={{
                        width: `${segProgress}%`,
                        backgroundColor: isCurrent ? '#00D8FF' : isPast ? '#3B82F6' : 'transparent',
                        boxShadow: isCurrent ? '0 0 10px rgba(0, 216, 255, 0.8)' : 'none',
                      }}
                    />
                  </div>
                  {/* Segment Label (Desktop) */}
                  <div className="hidden md:flex items-center justify-between text-[10px] font-mono">
                    <span className={`truncate font-semibold transition-colors ${
                      isCurrent
                        ? 'text-blue-600 dark:text-cyan-400 font-bold'
                        : isPast
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {ch.tabTitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN STORY SCREEN (Dynamic Interactive Kinetic Content)               */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 flex items-center justify-center">
        {/* Mobile Story Tap Areas: tap left for previous, tap right for next */}
        <div
          className="absolute inset-y-0 left-0 w-1/5 z-0 sm:hidden cursor-pointer"
          onClick={handlePrev}
          title="Previous slide"
        />
        <div
          className="absolute inset-y-0 right-0 w-1/5 z-0 sm:hidden cursor-pointer"
          onClick={handleNext}
          title="Next slide"
        />

        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <AnimatePresence mode="wait">
            {/* ----------------------------------------------------------------- */}
            {/* CHAPTER 1: INTRO ("Java Backend Journey Abhay Gupta")             */}
            {/* ----------------------------------------------------------------- */}
            {currentChapterIndex === 0 && (
              <motion.div
                key="ch-0"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex flex-col items-center text-center py-6 sm:py-10"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-xs font-mono font-bold text-blue-600 dark:text-cyan-300"
                >
                  <Coffee className="h-4 w-4" />
                  <span>CHAPTER 01 • OVERVIEW</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"
                >
                  <span className="block text-slate-900 dark:text-white">
                    Java Backend Journey
                  </span>
                  <span className="block bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 bg-clip-text text-transparent mt-1">
                    Abhay Gupta
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-5 max-w-2xl text-base sm:text-xl font-normal leading-relaxed text-slate-700 dark:text-slate-200"
                >
                  {currentChapter.subtitle}
                </motion.p>

                {/* Core Stack Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 flex flex-wrap items-center justify-center gap-2.5 max-w-2xl"
                >
                  {[
                    'Core Java 17/21',
                    'Spring Boot 3',
                    'Spring MVC',
                    'Monolithic Architecture',
                    'Hibernate & JPA ORM',
                    'MySQL Relational Modeling',
                    'RESTful APIs & JWT',
                    'Docker Microservices',
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-xl border border-slate-300/80 dark:border-blue-900/50 bg-white/90 dark:bg-[#0E1A30]/90 px-3.5 py-1.5 text-xs font-mono font-semibold text-slate-800 dark:text-cyan-300 shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="mt-10 flex items-center gap-3"
                >
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs sm:text-sm px-5 py-2.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <span>Begin Journey</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* CHAPTER 2: JAVA CORE TOPICS & INTERVIEW ESSENTIALS               */}
            {/* ----------------------------------------------------------------- */}
            {currentChapterIndex === 1 && (
              <motion.div
                key="ch-1"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="py-2 sm:py-4"
              >
                <div className="text-center max-w-2xl mx-auto mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 mb-2">
                    <Code2 className="w-3.5 h-3.5" />
                    JAVA CORE & INTERVIEW MASTERY
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
                    Java Core Topics & Concurrency Foundations
                  </h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    High-yield concepts tested in senior engineering technical interviews.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
                  {[
                    {
                      title: 'JVM Memory Architecture',
                      badge: 'Heap vs Stack vs Metaspace',
                      points: [
                        'Heap: Young Gen (Eden, S0, S1) & Old Gen (Tenured) for objects.',
                        'Thread Stack: Private frames for local vars & operand stack.',
                        'Metaspace: Native memory storing class metadata & bytecodes.',
                      ],
                    },
                    {
                      title: 'Garbage Collection (GC)',
                      badge: 'G1GC & ZGC Mechanics',
                      points: [
                        'G1GC: Region-based generational collection minimizing STW pauses.',
                        'ZGC: Concurrent colored pointers with < 1ms pause times.',
                        'Minor GC (Eden) vs Major/Full GC (Tenured compaction).',
                      ],
                    },
                    {
                      title: 'Collections & HashMap',
                      badge: 'Bucket Array & Treeification',
                      points: [
                        'Hashing index: (n - 1) & hash(key) using separate chaining.',
                        'Treeifies to Red-Black tree when bucket length >= 8 and cap >= 64.',
                        'ConcurrentHashMap: Lock-free reads, CAS & bucket-head locks.',
                      ],
                    },
                    {
                      title: 'Multithreading & Concurrency',
                      badge: 'ExecutorService & JMM',
                      points: [
                        'ThreadPoolExecutor: corePoolSize, maxPoolSize, BlockingQueue.',
                        'volatile: Enforces memory visibility & prevents instruction reordering.',
                        'Atomic variables: Hardware Compare-And-Swap (CAS) lock-freedom.',
                      ],
                    },
                    {
                      title: 'equals() & hashCode() Contract',
                      badge: 'Object Integrity',
                      points: [
                        'If a.equals(b) == true, a.hashCode() MUST equal b.hashCode().',
                        'Violating the contract corrupts HashMap and HashSet lookups.',
                        'Comparable<T> (natural order) vs Comparator<T> (custom multi-sort).',
                      ],
                    },
                    {
                      title: 'Java 17+ Modern Standards',
                      badge: 'LTS Language Features',
                      points: [
                        'Records: Immutable carrier models with compiler-generated accessors.',
                        'Sealed Classes: Strict hierarchy control via permits keyword.',
                        'Pattern Matching for instanceof & switch, Text blocks.',
                      ],
                    },
                  ].map((topic, i) => (
                    <motion.div
                      key={topic.title}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 * i }}
                      className="p-4 rounded-2xl border border-slate-200/90 dark:border-blue-900/50 bg-white/85 dark:bg-[#0B1528]/85 backdrop-blur-md shadow-xs hover:border-amber-400 dark:hover:border-amber-400/60 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
                            0{i + 1}.
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">
                            {topic.badge}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {topic.title}
                        </h3>
                        <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {topic.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* CHAPTER 3: MVC PATTERN & MONOLITHIC ARCHITECTURE                  */}
            {/* ----------------------------------------------------------------- */}
            {currentChapterIndex === 2 && (
              <motion.div
                key="ch-2"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="py-1 sm:py-3"
              >
                <div className="text-center max-w-2xl mx-auto mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 mb-2">
                    <Layers className="w-3.5 h-3.5" />
                    MVC & MONOLITHIC SYSTEM DESIGN
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
                    Spring MVC & Monolithic Architecture
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    Clean Model-View-Controller request flow combined with high-performance monolithic transactional boundaries.
                  </p>
                </div>

                {/* Section A: MVC Request Flow */}
                <div className="mb-4 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-blue-900/50 bg-white/85 dark:bg-[#0B1528]/85 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/70 dark:border-blue-900/40">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                      Spring MVC Pattern: End-to-End Request Pipeline
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-cyan-300 font-bold">
                      DispatcherServlet Flow
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {[
                      {
                        stage: '01. Client & Dispatcher',
                        role: 'DispatcherServlet',
                        desc: 'Front controller intercepts incoming HTTP requests and queries HandlerMapping for matching route.',
                        color: 'border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-cyan-400',
                      },
                      {
                        stage: '02. Controller Layer',
                        role: '@RestController',
                        desc: 'Validates DTO (@Valid), deserializes JSON via Jackson HttpMessageConverter, dispatches to service.',
                        color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
                      },
                      {
                        stage: '03. Service Layer',
                        role: '@Service @Transactional',
                        desc: 'Executes core business logic, coordinates domain rules, enforces ACID transaction boundary.',
                        color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
                      },
                      {
                        stage: '04. Model & Response',
                        role: 'Entities & View DTO',
                        desc: 'JPA entities hydrate from database. Controller projects secure DTO back to Client UI as JSON.',
                        color: 'border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400',
                      },
                    ].map((step) => (
                      <div
                        key={step.stage}
                        className="p-3 rounded-xl border border-slate-200 dark:border-blue-900/40 bg-slate-50/70 dark:bg-[#0E1A30]/70"
                      >
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {step.stage}
                        </span>
                        <div className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                          {step.role}
                        </div>
                        <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: Monolithic Architecture Strengths */}
                <div className="p-4 sm:p-5 rounded-2xl border border-blue-500/30 bg-blue-50/60 dark:bg-[#0E1A30]/80 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-200 dark:border-blue-900/50">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Box className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Production Strengths of Monolithic Architecture
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold">
                      Zero Distributed Friction
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-blue-900/40 bg-white/80 dark:bg-[#0B1528]/80">
                      <div className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400">
                        1. Single Deployable Unit
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        Packaged into a single optimized Spring Boot executable JAR. Eliminates multi-service container orchestration nightmares and simplifies CI/CD.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 dark:border-blue-900/40 bg-white/80 dark:bg-[#0B1528]/80">
                      <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        2. In-Process ACID Integrity
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        Single @Transactional boundary guarantees atomicity. No fragile 2PC (Two-Phase Commit) or complex Saga compensations required across network partitions.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 dark:border-blue-900/40 bg-white/80 dark:bg-[#0B1528]/80">
                      <div className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                        3. Zero Network Serialization Latency
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        Internal module calls execute as direct in-memory method invocations (&lt; 0.1ms) instead of costly HTTP/gRPC network hops between services.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* CHAPTER 4: ORM, HIBERNATE & JPA + ACTUAL ARCHITECTURE DIAGRAM     */}
            {/* ----------------------------------------------------------------- */}
            {currentChapterIndex === 3 && (
              <motion.div
                key="ch-3"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="py-1 sm:py-2"
              >
                {/* User Prompt Exact Required Quote Banner */}
                <div className="p-4 sm:p-5 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 dark:bg-cyan-950/30 backdrop-blur-md mb-4">
                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-700 dark:text-cyan-300">
                        CORE ORM ARCHITECTURE
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                        ORM (Object-Relational Mapping): Hibernate and JPA for mapping Java objects directly to database tables.
                      </h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                        Eliminates manual JDBC code, manages entity lifecycles, and maintains relational integrity using Hibernate dialects and dirty checking.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Abhay's Actual Architecture Diagram & Relational Mapping */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
                  {/* Left 7 Cols: Abhay's Actual Multi-Tier Architecture Pipeline */}
                  <div className="lg:col-span-7 p-4 rounded-2xl border border-slate-200/90 dark:border-blue-900/50 bg-white/85 dark:bg-[#0B1528]/85 backdrop-blur-md flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/70 dark:border-blue-900/40">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            What We Built: Architecture & Data Mapping Pipeline
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          Multi-Tier Java Stack
                        </span>
                      </div>

                      {/* Architecture Step Flow */}
                      <div className="space-y-2">
                        {/* Layer 1: Client UI */}
                        <div className="p-2.5 rounded-xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-6 w-6 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center">1</span>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">Client UI & Admin Interface</div>
                              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">React 19 SPA • HTTPS JSON Payload</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-blue-600 dark:text-cyan-300 font-semibold">User Credentials / Profile Data</span>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center text-slate-400 dark:text-slate-600 text-xs">↓</div>

                        {/* Layer 2: Spring MVC & Security */}
                        <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-50/50 dark:bg-cyan-950/20 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-6 w-6 rounded-lg bg-cyan-600 text-white font-mono text-xs font-bold flex items-center justify-center">2</span>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">Spring Boot 3 MVC Controller & Service</div>
                              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">@RestController • @Transactional Boundary • JWT Auth</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-300 font-semibold">DTO Validation & Business Logic</span>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center text-slate-400 dark:text-slate-600 text-xs">↓</div>

                        {/* Layer 3: Hibernate ORM Engine */}
                        <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-6 w-6 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold flex items-center justify-center">3</span>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">Hibernate 6 / JPA Persistence Context</div>
                              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">First-Level Cache • Automated Dirty Checking • HikariCP</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 font-semibold">Object-to-Relational Mapping</span>
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center text-slate-400 dark:text-slate-600 text-xs">↓</div>

                        {/* Layer 4: Relational MySQL Database */}
                        <div className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-6 w-6 rounded-lg bg-purple-600 text-white font-mono text-xs font-bold flex items-center justify-center">4</span>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">Relational Database (MySQL 8 / ACID Storage)</div>
                              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">user_accounts & portfolio_data tables (1-to-1 Tenant Isolation)</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-purple-600 dark:text-purple-300 font-semibold">B-Tree Indexes & Constraints</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/70 dark:border-blue-900/40 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <span>Zero Boilerplate JDBC</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">ACID Transaction Guarantees</span>
                    </div>
                  </div>

                  {/* Right 5 Cols: Real JPA Entity Code for Abhay's Application */}
                  <div className="lg:col-span-5 p-4 rounded-2xl border border-slate-200/90 dark:border-blue-900/50 bg-[#070F1E] text-slate-200 flex flex-col justify-between font-mono text-xs">
                    <div>
                      {/* Tabs */}
                      <div className="flex items-center gap-1.5 pb-2 border-b border-blue-900/50 mb-3 overflow-x-auto no-scrollbar">
                        {[
                          { id: 'UserAccount', label: 'UserAccount.java' },
                          { id: 'PortfolioData', label: 'PortfolioData.java' },
                          { id: 'PortfolioRepository', label: 'Repository.java' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setActiveEntityTab(t.id as any)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors cursor-pointer ${
                              activeEntityTab === t.id
                                ? 'bg-blue-600 text-white font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {/* Dynamic Code Viewer */}
                      {activeEntityTab === 'UserAccount' && (
                        <pre className="text-[11px] leading-relaxed text-slate-300 overflow-x-auto no-scrollbar">
                          <code>{`@Entity
@Table(name = "user_accounts")
public class UserAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "salt", nullable = false)
    private String salt;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "portfolio_id", referencedColumnName = "portfolio_id")
    private PortfolioData portfolio;
}`}</code>
                        </pre>
                      )}

                      {activeEntityTab === 'PortfolioData' && (
                        <pre className="text-[11px] leading-relaxed text-slate-300 overflow-x-auto no-scrollbar">
                          <code>{`@Entity
@Table(name = "portfolio_data")
public class PortfolioData {
    @Id
    @Column(name = "portfolio_id", nullable = false)
    private String portfolioId;

    @Lob
    @Column(name = "profile_json", columnDefinition = "JSON")
    private String profile;

    @Lob
    @Column(name = "projects_json", columnDefinition = "JSON")
    private String projects;

    @Lob
    @Column(name = "experiences_json", columnDefinition = "JSON")
    private String experiences;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}`}</code>
                        </pre>
                      )}

                      {activeEntityTab === 'PortfolioRepository' && (
                        <pre className="text-[11px] leading-relaxed text-slate-300 overflow-x-auto no-scrollbar">
                          <code>{`@Repository
public interface PortfolioRepository extends JpaRepository<PortfolioData, String> {
    // Solves N+1 Problem: fetches User + Portfolio in single JOIN query
    @Query("SELECT u FROM UserAccount u JOIN FETCH u.portfolio WHERE u.email = :email")
    Optional<UserAccount> findByEmailWithPortfolio(@Param("email") String email);

    @EntityGraph(attributePaths = {"portfolio"})
    Optional<UserAccount> findById(Long id);
}`}</code>
                        </pre>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-blue-900/50 flex items-center justify-between text-[10px] text-slate-400">
                      <span>JOIN FETCH & EntityGraph</span>
                      <span className="text-cyan-400 font-semibold">Zero N+1 Query Overhead</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* CHAPTER 5: PRODUCTION & SUMMARY                                  */}
            {/* ----------------------------------------------------------------- */}
            {currentChapterIndex === 4 && (
              <motion.div
                key="ch-4"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex flex-col items-center text-center py-6 sm:py-8"
              >
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-xs font-mono font-bold text-purple-600 dark:text-purple-300">
                  <Zap className="h-4 w-4" />
                  <span>CHAPTER 05 • PRODUCTION DELIVERY</span>
                </div>

                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">
                  Enterprise Ready & Continuously Delivered
                </h2>

                <p className="mt-3 max-w-2xl text-xs sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                  Combining clean Java architecture, optimized SQL queries, Hibernate mapping, and Docker microservices to deliver reliable end-to-end applications.
                </p>

                {/* 3 Value Pillars */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl w-full text-left">
                  <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-blue-900/50 bg-white/80 dark:bg-[#0B1528]/80 backdrop-blur-md">
                    <div className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400 mb-1">
                      01. CLEAN LAYERS
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Controller-Service-Repo
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Decoupled business logic ready for unit and integration testing.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-blue-900/50 bg-white/80 dark:bg-[#0B1528]/80 backdrop-blur-md">
                    <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      02. ZERO N+1 QUERIES
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Optimized Hibernate
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      JOIN FETCH, entity graphs, and proper indexing for lightning DB latency.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-blue-900/50 bg-white/80 dark:bg-[#0B1528]/80 backdrop-blur-md">
                    <div className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">
                      03. DOCKER & CI/CD
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Container Delivery
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Standardized builds with Maven, Dockerized runtime, and automated testing.
                    </div>
                  </div>
                </div>

                {/* Final Actions */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-blue-800/80 bg-white dark:bg-[#0E1A30] px-4 py-2.5 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-500 transition-all cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Replay Journey
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closeOneShot();
                      openResumeHeist();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-mono font-bold text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Résumé
                  </button>

                  <button
                    type="button"
                    onClick={closeOneShot}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-blue-800/80 px-4 py-2.5 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#132238] transition-all cursor-pointer"
                  >
                    <span>Exit Full Screen</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. BOTTOM CINEMATIC CONTROLLER DOCK (Play/Pause, Step, Chapters)          */}
      {/* ========================================================================= */}
      <footer className={`relative z-20 w-full border-t backdrop-blur-xl px-4 py-3 sm:px-6 transition-colors ${
        isDark ? 'border-blue-900/40 bg-[#070F1E]/80' : 'border-slate-200/90 bg-white/85 shadow-xs'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          {/* Chapter Progress Tag */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="font-bold text-blue-600 dark:text-cyan-400">
              0{currentChapterIndex + 1} / 0{CHAPTERS.length}
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline font-semibold text-slate-800 dark:text-slate-200">
              {currentChapter.tabTitle}
            </span>
          </div>

          {/* Central Playback Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentChapterIndex === 0}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0E1A30] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              title="Previous Chapter (Left Arrow)"
              aria-label="Previous"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/30 transition-transform active:scale-95 cursor-pointer"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentChapterIndex === CHAPTERS.length - 1}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0E1A30] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              title="Next Chapter (Right Arrow)"
              aria-label="Next"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-[#0E1A30] transition cursor-pointer"
              title="Restart from Beginning"
              aria-label="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Shortcuts Hint */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>[Space] Pause</span>
            <span>[←/→] Navigate</span>
            <span>[ESC] Close</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
