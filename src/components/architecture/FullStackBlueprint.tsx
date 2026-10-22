import React, { useState, useEffect } from 'react';
import {
  Database,
  Shield,
  Cloud,
  Coffee,
  Settings,
  Network,
  Target,
  ArrowRight,
  Code2,
  Sparkles,
  Layers,
  Play,
  RotateCcw,
  CheckCircle2,
  Lock,
  Cpu,
  Compass,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Custom high-fidelity React Atom icon matching the blueprint
const ReactAtomIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <ellipse cx="50" cy="50" rx="42" ry="16" stroke="currentColor" strokeWidth="4" transform="rotate(0 50 50)" />
    <ellipse cx="50" cy="50" rx="42" ry="16" stroke="currentColor" strokeWidth="4" transform="rotate(60 50 50)" />
    <ellipse cx="50" cy="50" rx="42" ry="16" stroke="currentColor" strokeWidth="4" transform="rotate(120 50 50)" />
    <circle cx="50" cy="50" r="7" fill="currentColor" />
  </svg>
);

// Custom Spring Boot leaf / power badge icon matching the reference image
const SpringBootLeafIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="currentColor" className="opacity-15" />
    <path
      d="M12 3v9M18.36 6.64a9 9 0 1 1-12.73 0"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 3-Tier Database cylinder stack icon matching the blueprint
const DatabaseStackIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <ellipse cx="12" cy="5" rx="8" ry="3" stroke="currentColor" strokeWidth="2.2" fill="currentColor" fillOpacity="0.15" />
    <path d="M4 5v5c0 1.66 3.58 3 8 3s8-1.34 8-3V5" stroke="currentColor" strokeWidth="2.2" />
    <path d="M4 10v5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5" stroke="currentColor" strokeWidth="2.2" />
    <path d="M4 15v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4" stroke="currentColor" strokeWidth="2.2" />
  </svg>
);

// Shield Lock Icon matching the reference image
const SecurityShieldIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke="currentColor"
      strokeWidth="2.2"
      fill="currentColor"
      fillOpacity="0.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="9.5" y="11" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.8" />
    <path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

// Cloud Server Icon matching the reference image
const CloudDeployIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"
      stroke="currentColor"
      strokeWidth="2.2"
      fill="currentColor"
      fillOpacity="0.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Stylized Geometric Mountain Peaks Icon matching the bottom right of the image
const MountainPeaksIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <path
      d="M4 24L13 9L18 17L22 11L28 24H4Z"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M10 14L13 9L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="27" cy="8" r="1.5" fill="currentColor" />
  </svg>
);

interface PipelineStep {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  icon: (isDark: boolean) => React.ReactNode;
  neonColor: string;
  lightAccentColor: string;
  darkBorder: string;
  lightBorder: string;
  darkGlow: string;
  lightGlow: string;
  telemetry: {
    protocol: string;
    description: string;
    tech: string;
    latency: string;
  };
}

interface DisciplineCategory {
  id: string;
  title: string;
  icon: (isDark: boolean) => React.ReactNode;
  accentBadge: string;
  relatedStepId: string;
  items: string[];
}

export const FullStackBlueprint: React.FC = () => {
  const { isDark } = useTheme();
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simStepIndex, setSimStepIndex] = useState<number>(-1);

  // 1. The 5 Horizontal Pipeline Steps matching the reference image exactly
  const pipelineSteps: PipelineStep[] = [
    {
      id: 'frontend',
      stepNumber: '01',
      title: 'Frontend',
      subtitle: 'React + JS',
      icon: (dark) => (
        <ReactAtomIcon
          className={`w-9 h-9 transition-transform duration-300 group-hover:scale-110 ${
            dark
              ? 'text-[#00D8FF] drop-shadow-[0_0_12px_rgba(0,216,255,0.7)]'
              : 'text-[#0284C7] drop-shadow-[0_0_8px_rgba(2,132,199,0.3)]'
          }`}
        />
      ),
      neonColor: '#00D8FF',
      lightAccentColor: '#0284C7',
      darkBorder: 'border-[#00D8FF]/70 hover:border-[#00D8FF]',
      lightBorder: 'border-sky-300 hover:border-sky-500',
      darkGlow: 'shadow-[0_0_24px_rgba(0,216,255,0.35)]',
      lightGlow: 'shadow-[0_4px_20px_rgba(2,132,199,0.18)]',
      telemetry: {
        protocol: 'HTTPS / JSON Client',
        description: 'Component architecture, responsive state & dynamic UI rendering',
        tech: 'React 19, TypeScript, Tailwind CSS, Axios',
        latency: '1.2ms render',
      },
    },
    {
      id: 'backend',
      stepNumber: '02',
      title: 'API / Backend',
      subtitle: 'Spring Boot',
      icon: (dark) => (
        <SpringBootLeafIcon
          className={`w-9 h-9 transition-transform duration-300 group-hover:scale-110 ${
            dark
              ? 'text-[#22C55E] drop-shadow-[0_0_12px_rgba(34,197,94,0.7)]'
              : 'text-[#16A34A] drop-shadow-[0_0_8px_rgba(22,163,74,0.3)]'
          }`}
        />
      ),
      neonColor: '#22C55E',
      lightAccentColor: '#16A34A',
      darkBorder: 'border-[#22C55E]/70 hover:border-[#22C55E]',
      lightBorder: 'border-emerald-300 hover:border-emerald-500',
      darkGlow: 'shadow-[0_0_24px_rgba(34,197,94,0.35)]',
      lightGlow: 'shadow-[0_4px_20px_rgba(22,163,74,0.18)]',
      telemetry: {
        protocol: 'RESTful API / Spring MVC',
        description: 'Layered controllers, business service validation & exception handling',
        tech: 'Spring Boot 3, Java 17+, Maven, REST APIs',
        latency: '4.8ms route',
      },
    },
    {
      id: 'database',
      stepNumber: '03',
      title: 'Database',
      subtitle: 'SQL + JPA',
      icon: (dark) => (
        <DatabaseStackIcon
          className={`w-9 h-9 transition-transform duration-300 group-hover:scale-110 ${
            dark
              ? 'text-[#3B82F6] drop-shadow-[0_0_12px_rgba(59,130,246,0.7)]'
              : 'text-[#2563EB] drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]'
          }`}
        />
      ),
      neonColor: '#3B82F6',
      lightAccentColor: '#2563EB',
      darkBorder: 'border-[#3B82F6]/70 hover:border-[#3B82F6]',
      lightBorder: 'border-blue-300 hover:border-blue-500',
      darkGlow: 'shadow-[0_0_24px_rgba(59,130,246,0.35)]',
      lightGlow: 'shadow-[0_4px_20px_rgba(37,99,235,0.18)]',
      telemetry: {
        protocol: 'JDBC / ORM SQL',
        description: 'ACID transactions, relational schema design & connection pooling',
        tech: 'MySQL, PostgreSQL, Spring Data JPA, Hibernate',
        latency: '2.1ms query',
      },
    },
    {
      id: 'security',
      stepNumber: '04',
      title: 'Security',
      subtitle: 'JWT + Auth',
      icon: (dark) => (
        <SecurityShieldIcon
          className={`w-9 h-9 transition-transform duration-300 group-hover:scale-110 ${
            dark
              ? 'text-[#A855F7] drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]'
              : 'text-[#9333EA] drop-shadow-[0_0_8px_rgba(147,51,234,0.3)]'
          }`}
        />
      ),
      neonColor: '#A855F7',
      lightAccentColor: '#9333EA',
      darkBorder: 'border-[#A855F7]/70 hover:border-[#A855F7]',
      lightBorder: 'border-purple-300 hover:border-purple-500',
      darkGlow: 'shadow-[0_0_24px_rgba(168,85,247,0.35)]',
      lightGlow: 'shadow-[0_4px_20px_rgba(147,51,234,0.18)]',
      telemetry: {
        protocol: 'Bearer JWT / OAuth2',
        description: 'Role-based access control, cryptographic verification & filter chains',
        tech: 'Spring Security, JWT Token Claims, Bcrypt, CORS/CSRF',
        latency: '0.8ms verify',
      },
    },
    {
      id: 'deployment',
      stepNumber: '05',
      title: 'Deployment',
      subtitle: 'Docker + Cloud',
      icon: (dark) => (
        <CloudDeployIcon
          className={`w-9 h-9 transition-transform duration-300 group-hover:scale-110 ${
            dark
              ? 'text-[#06B6D4] drop-shadow-[0_0_12px_rgba(6,182,212,0.7)]'
              : 'text-[#0D9488] drop-shadow-[0_0_8px_rgba(13,148,136,0.3)]'
          }`}
        />
      ),
      neonColor: '#06B6D4',
      lightAccentColor: '#0D9488',
      darkBorder: 'border-[#06B6D4]/70 hover:border-[#06B6D4]',
      lightBorder: 'border-teal-300 hover:border-teal-500',
      darkGlow: 'shadow-[0_0_24px_rgba(6,182,212,0.35)]',
      lightGlow: 'shadow-[0_4px_20px_rgba(13,148,136,0.18)]',
      telemetry: {
        protocol: 'OCI Container / HTTP/2',
        description: 'Containerized microservices, reverse proxy & CI/CD deployment',
        tech: 'Docker, Cloud VMs, GitHub Actions, Nginx, Firebase',
        latency: '99.98% uptime',
      },
    },
  ];

  // 2. The 6 Sub-discipline blocks mapped in 3 columns (Strictly matching official resume skills)
  const column1Disciplines: DisciplineCategory[] = [
    {
      id: 'java-backend',
      title: 'Java & Backend',
      icon: (dark) => <Coffee className={`w-5 h-5 ${dark ? 'text-[#38BDF8]' : 'text-[#0284C7]'}`} />,
      accentBadge: 'Core Services',
      relatedStepId: 'backend',
      items: [
        'Core Java, OOP, Collections',
        'Streams, Exception Handling',
        'Spring Boot 3, RESTful APIs',
        'Spring Data JPA, Hibernate, Maven',
      ],
    },
    {
      id: 'security-quality',
      title: 'Security & Quality',
      icon: (dark) => <Lock className={`w-5 h-5 ${dark ? 'text-[#C084FC]' : 'text-[#9333EA]'}`} />,
      accentBadge: 'Zero Trust',
      relatedStepId: 'security',
      items: [
        'Spring Security & BCrypt',
        'JWT Authentication',
        'Role-Based Access Control (RBAC)',
        'Validation, Testing & Debugging',
        'Clean Layered Architecture',
      ],
    },
  ];

  const column2Disciplines: DisciplineCategory[] = [
    {
      id: 'frontend-discipline',
      title: 'Frontend',
      icon: (dark) => <ReactAtomIcon className={`w-5 h-5 ${dark ? 'text-[#00D8FF]' : 'text-[#0284C7]'}`} />,
      accentBadge: 'Client Layer',
      relatedStepId: 'frontend',
      items: [
        'JavaScript (ES6+)',
        'React & Component State',
        'HTML5, CSS3 & Tailwind CSS',
        'REST API Integration & Testing',
      ],
    },
    {
      id: 'engineering-tools',
      title: 'Engineering Tools',
      icon: (dark) => <Settings className={`w-5 h-5 ${dark ? 'text-[#2DD4BF]' : 'text-[#0D9488]'}`} />,
      accentBadge: 'DevOps & Tooling',
      relatedStepId: 'deployment',
      items: [
        'Git & GitHub Version Control',
        'Maven Build Lifecycle',
        'Postman API Testing',
        'IntelliJ IDEA & VS Code',
      ],
    },
  ];

  const column3Disciplines: DisciplineCategory[] = [
    {
      id: 'data-persistence',
      title: 'Data & Persistence',
      icon: (dark) => <Database className={`w-5 h-5 ${dark ? 'text-[#60A5FA]' : 'text-[#2563EB]'}`} />,
      accentBadge: 'Storage Tier',
      relatedStepId: 'database',
      items: [
        'MySQL, MongoDB & H2',
        'CRUD & Relational Schema Design',
        'Indexing & Query Optimization',
        'ACID Transactions & Caching',
      ],
    },
    {
      id: 'modern-architecture',
      title: 'Modern Architecture',
      icon: (dark) => <Network className={`w-5 h-5 ${dark ? 'text-[#A78BFA]' : 'text-[#7C3AED]'}`} />,
      accentBadge: 'Architecture & Cloud',
      relatedStepId: 'backend',
      items: [
        'Layered MVC Architecture',
        'Microservices Design Principles',
        'Cloud Deployment (Render, Firebase)',
        'Debugging & SDLC Best Practices',
      ],
    },
  ];

  // Automated Request Simulation Flow
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (simulating) {
      if (simStepIndex < pipelineSteps.length - 1) {
        timer = setTimeout(() => {
          setSimStepIndex((prev) => prev + 1);
          setActiveStepId(pipelineSteps[simStepIndex + 1].id);
        }, 1100);
      } else {
        timer = setTimeout(() => {
          setSimulating(false);
          setSimStepIndex(-1);
          setActiveStepId(null);
        }, 1400);
      }
    }
    return () => clearTimeout(timer);
  }, [simulating, simStepIndex]);

  const handleStartSimulation = () => {
    if (simulating) {
      setSimulating(false);
      setSimStepIndex(-1);
      setActiveStepId(null);
    } else {
      setSimulating(true);
      setSimStepIndex(0);
      setActiveStepId(pipelineSteps[0].id);
    }
  };

  const currentActiveStep = pipelineSteps.find(
    (s) => s.id === (simulating && simStepIndex >= 0 ? pipelineSteps[simStepIndex].id : activeStepId)
  );

  return (
    <section
      id="architecture-blueprint"
      className={`relative py-24 sm:py-32 overflow-hidden transition-colors duration-500 ${
        isDark
          ? 'bg-[#050A14] text-[#E2E8F0]'
          : 'bg-[#F8FAFD] text-[#0F172A]'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC HORIZON & MOUNTAIN SCENERY (Ultra-attractive in Dark & Light) */}
      {/* ========================================================================= */}
      {isDark ? (
        <>
          {/* Deep Translucent Cosmic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060D1A]/50 to-[#0A162E]/70 pointer-events-none" />

          {/* Blueprint Matrix Grid */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#38BDF8 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Celestial Stars */}
          <div className="absolute top-16 left-1/4 w-1.5 h-1.5 rounded-full bg-blue-300/80 animate-pulse pointer-events-none" />
          <div className="absolute top-28 left-2/3 w-1 h-1 rounded-full bg-white/90 pointer-events-none" />
          <div className="absolute top-44 left-1/3 w-2 h-2 rounded-full bg-cyan-300/50 blur-[1px] pointer-events-none" />
          <div className="absolute top-64 right-1/4 w-1.5 h-1.5 rounded-full bg-white/70 pointer-events-none" />

          {/* CINEMATIC TWILIGHT SUNSET & MOUNTAIN RIDGE SILHOUETTE (Full-Width Responsive) */}
          <div className="absolute right-0 bottom-0 w-full sm:w-[900px] lg:w-[1150px] h-[380px] sm:h-[520px] lg:h-[580px] pointer-events-none overflow-hidden z-0">
            {/* Primary Dusk Sunset Radial Glow */}
            <div
              className="absolute -right-8 bottom-10 w-[580px] h-[420px] rounded-full blur-[100px] pointer-events-none opacity-90"
              style={{
                background: 'radial-gradient(circle, rgba(255,107,74,0.75) 0%, rgba(245,158,11,0.55) 35%, rgba(139,92,246,0.3) 70%, transparent 100%)',
              }}
            />

            {/* Secondary Golden Horizon Flare */}
            <div
              className="absolute right-24 bottom-4 w-[380px] h-[240px] rounded-full blur-[70px] pointer-events-none opacity-80"
              style={{
                background: 'radial-gradient(circle, rgba(251,146,60,0.85) 0%, rgba(217,70,239,0.35) 60%, transparent 100%)',
              }}
            />

            {/* Layered Vector Mountain Silhouette with Peak Flag */}
            <svg
              className="absolute right-0 bottom-0 w-full h-full"
              viewBox="0 0 1000 500"
              preserveAspectRatio="xMaxYMax slice"
              fill="none"
            >
              <defs>
                <linearGradient id="foreMountainGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0E1726" />
                  <stop offset="100%" stopColor="#03060B" />
                </linearGradient>
                <linearGradient id="midMountainGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#251F3D" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#070C16" />
                </linearGradient>
                <linearGradient id="distMountainGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4A2840" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#0D1628" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Distant Ridge */}
              <path
                d="M160 500 L300 410 L430 435 L560 380 L690 415 L820 340 L930 385 L1000 360 L1000 500 Z"
                fill="url(#distMountainGradDark)"
              />

              {/* Midground Crags */}
              <path
                d="M320 500 L450 440 L570 460 L680 390 L790 425 L880 330 L950 355 L1000 310 L1000 500 Z"
                fill="url(#midMountainGradDark)"
              />

              {/* High Foreground Peak */}
              <path
                d="M460 500 L610 455 L700 470 L790 385 L860 410 L948 240 L952 240 L975 315 L1000 340 L1000 500 Z"
                fill="url(#foreMountainGradDark)"
              />
              <path
                d="M948 240 L860 410 L790 385 L750 440 L830 500 L1000 500 L1000 340 Z"
                fill="#03060B"
              />

              {/* Summit Flag planted at the peak */}
              <g className="transform origin-[948px_240px]">
                <line x1="948" y1="240" x2="948" y2="210" stroke="#E2E8F0" strokeWidth="2.4" strokeLinecap="round" />
                <path
                  d="M948 212 L970 220 L948 228 Z"
                  fill="#F59E0B"
                  stroke="#FF6B4A"
                  strokeWidth="1.2"
                  className="animate-[flagFlutter_3s_ease-in-out_infinite]"
                />
                <circle cx="948" cy="210" r="2.5" fill="#FBBF24" />
                <circle cx="948" cy="210" r="5" fill="#FBBF24" fillOpacity="0.4" className="animate-ping" />
              </g>
            </svg>
          </div>
        </>
      ) : (
        /* Light Mode: Alpine Dawn Mist Canvas (Refined & Ultra-Attractive) */
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F1F5F9]/40 to-[#E2E8F0]/60 pointer-events-none" />

          {/* Blueprint Architect Grid */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#0F172A 1.2px, transparent 1.2px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Morning Sunrise Alpine Horizon Glow */}
          <div className="absolute right-0 bottom-0 w-full sm:w-[900px] lg:w-[1100px] h-[380px] sm:h-[500px] lg:h-[560px] pointer-events-none overflow-hidden z-0">
            {/* Soft Sunrise Golden-Peach Aura */}
            <div
              className="absolute -right-6 bottom-8 w-[540px] h-[380px] rounded-full blur-[90px] pointer-events-none opacity-70"
              style={{
                background: 'radial-gradient(circle, rgba(251,146,60,0.3) 0%, rgba(56,189,248,0.25) 45%, rgba(168,85,247,0.15) 80%, transparent 100%)',
              }}
            />

            {/* Frosted Glass Alpine Mountain Silhouette */}
            <svg
              className="absolute right-0 bottom-0 w-full h-full"
              viewBox="0 0 1000 500"
              preserveAspectRatio="xMaxYMax slice"
              fill="none"
            >
              <defs>
                <linearGradient id="foreMountainGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#475569" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1E293B" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="midMountainGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#64748B" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#475569" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Midground Ridge */}
              <path
                d="M320 500 L450 440 L570 460 L680 390 L790 425 L880 330 L950 355 L1000 310 L1000 500 Z"
                fill="url(#midMountainGradLight)"
              />

              {/* Foreground Alpine Peak */}
              <path
                d="M460 500 L610 455 L700 470 L790 385 L860 410 L948 240 L975 315 L1000 340 L1000 500 Z"
                fill="url(#foreMountainGradLight)"
              />

              {/* Summit Flag planted at the peak */}
              <g className="transform origin-[948px_240px]">
                <line x1="948" y1="240" x2="948" y2="210" stroke="#334155" strokeWidth="2.4" strokeLinecap="round" />
                <path
                  d="M948 212 L970 220 L948 228 Z"
                  fill="#F59E0B"
                  stroke="#EA580C"
                  strokeWidth="1.2"
                />
                <circle cx="948" cy="210" r="2.5" fill="#F59E0B" />
              </g>
            </svg>
          </div>
        </>
      )}


      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">

        {/* ========================================================================= */}
        {/* 2. ARCHITECTURAL HUD STATUS BAR & CONTROLS                                */}
        {/* ========================================================================= */}
        <div className={`flex flex-wrap items-center justify-between gap-4 mb-12 pb-5 border-b ${
          isDark ? 'border-cyan-500/20' : 'border-slate-300'
        }`}>
          {/* Monogram & Title Tag */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs font-mono shadow-sm ${
              isDark
                ? 'bg-[#111C2E] border border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-white border border-slate-300 text-blue-600 shadow-sm'
            }`}>
              AG
            </div>
            <span className={`font-mono font-bold text-xl tracking-tight ${
              isDark ? 'text-[#3B82F6]' : 'text-blue-600'
            }`}>
              /&gt;
            </span>
            <div className={`hidden sm:flex items-center gap-2 pl-2 text-[11px] font-mono uppercase tracking-widest font-semibold ${
              isDark ? 'text-[#94A3B8]' : 'text-slate-600'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Full-Stack Blueprint // Systems Architecture</span>
            </div>
          </div>

          {/* Interactive Simulation Trigger Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartSimulation}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all duration-300 border ${
                simulating
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : isDark
                  ? 'bg-[#0E1A30]/80 text-[#CBD5E1] border-blue-500/30 hover:border-cyan-400 hover:text-white'
                  : 'bg-white text-slate-800 border-slate-300 hover:border-blue-500 hover:bg-slate-50 shadow-sm'
              }`}
              title="Trigger active data packet flow through full stack nodes"
            >
              {simulating ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>Tracing Request...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                  <span>Trace Pipeline Flow</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. HERO HEADLINE & PHILOSOPHY HANDWRITTEN CALLOUT                         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start mb-16 sm:mb-20">
          {/* Left Column: Bold Typography & Manifesto */}
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-3">
              <span className={isDark ? 'text-[#4E75FF] drop-shadow-[0_0_18px_rgba(78,117,255,0.4)]' : 'text-[#2563EB]'}>
                Java
              </span>{' '}
              <span className={isDark ? 'text-white' : 'text-[#0F172A]'}>
                Full Stack Development
              </span>
            </h1>

            <p className={`text-xl sm:text-2xl font-semibold tracking-wider mb-4 ${
              isDark ? 'text-[#94A3B8]' : 'text-[#334155]'
            }`}>
              Building End-to-End Applications
            </p>

            {/* Glowing Accent Underline Bar */}
            <div className={`w-20 h-1.5 rounded-full mb-6 ${
              isDark ? 'bg-[#4E75FF] shadow-[0_0_12px_rgba(78,117,255,0.8)]' : 'bg-[#2563EB]'
            }`} />

            {/* Introductory Manifesto with High Contrast in Light & Dark */}
            <p className={`text-base sm:text-lg leading-relaxed font-normal max-w-2xl ${
              isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'
            }`}>
              With a foundation in Java, SQL and application development, I'm strengthening my skills across the full stack — not just by learning new tools, but by understanding{' '}
              <span className={`font-bold px-1.5 py-0.5 rounded border-b ${
                isDark
                  ? 'text-[#60A5FA] bg-blue-500/10 border-blue-500/50'
                  : 'text-[#1D4ED8] bg-blue-50 border-blue-300'
              }`}>
                how everything works together
              </span>
              .
            </p>
          </div>

          {/* Right Column: Clean Glass Engineering Principles Badge (Strict 2-font system) */}
          <div className="lg:pt-2 flex flex-col items-start lg:items-end select-none">
            <div
              className={`rounded-2xl border p-4 sm:p-5 backdrop-blur-xl transition-all ${
                isDark
                  ? 'bg-[#0B1424]/85 border-blue-900/50 text-slate-200 shadow-[0_12px_30px_rgba(0,0,0,0.4)]'
                  : 'bg-white/90 border-slate-200 text-slate-800 shadow-sm'
              }`}
            >
              <span className="block font-mono text-[10px] uppercase tracking-widest text-blue-600 dark:text-cyan-400 mb-2">
                // Architecture Principles
              </span>
              <div className="flex sm:flex-col gap-2 sm:gap-1.5 font-sans text-sm sm:text-base font-bold">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Better Code
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Better Systems
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Bigger Goals
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. THE HORIZONTAL ARCHITECTURE PIPELINE (5 Neon Glass Cards)              */}
        {/* ========================================================================= */}
        <div className="mb-14 sm:mb-18">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <Layers className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
              <h2 className={`text-sm sm:text-base font-mono uppercase tracking-wider font-bold ${
                isDark ? 'text-cyan-300' : 'text-[#0F172A]'
              }`}>
                Pipeline Execution Flow
              </h2>
            </div>
            <div className={`text-xs font-mono font-medium ${isDark ? 'text-[#94A3B8]' : 'text-slate-600'}`}>
              {simulating ? (
                <span className="text-cyan-500 font-bold animate-pulse">
                  ● Packet Active: Node {simStepIndex + 1}/5
                </span>
              ) : (
                <span>Swipe or click nodes</span>
              )}
            </div>
          </div>

          {/* Single Adaptive Pipeline Row: Horizontal Snap Slides on Mobile -> 5-Column Grid on Laptop */}
          <div className="flex lg:grid lg:grid-cols-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory gap-3.5 lg:gap-4 items-stretch no-scrollbar pb-2">
            {pipelineSteps.map((step, idx) => {
              const isActive = activeStepId === step.id;
              const isSimActive = simulating && simStepIndex === idx;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStepId(isActive ? null : step.id)}
                  onMouseEnter={() => !simulating && setActiveStepId(step.id)}
                  className={`
                    snap-center shrink-0 w-[72vw] sm:w-[44vw] lg:w-auto relative group p-5 sm:p-6 rounded-2xl transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between
                    ${isDark
                      ? 'bg-[#0B1424]/90 backdrop-blur-xl border'
                      : 'bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-xs'
                    }
                    ${isSimActive || isActive
                      ? isDark
                        ? `${step.darkBorder} ${step.darkGlow} scale-[1.02] z-20 bg-[#0B1528]`
                        : `${step.lightBorder} ${step.lightGlow} scale-[1.02] z-20 bg-white ring-2 ring-blue-500/30`
                      : isDark
                      ? 'border-white/10 hover:border-white/30'
                      : 'hover:border-slate-300 hover:shadow-md'
                    }
                  `}
                >
                  {/* Top Accent Strip */}
                  <div
                    className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${isDark ? step.neonColor : step.lightAccentColor}, transparent)`,
                      opacity: isActive || isSimActive ? 1 : 0.4,
                    }}
                  />

                  {/* Step Sequence Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-mono text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${
                      isDark
                        ? 'bg-[#101D33] text-[#94A3B8] border-white/10'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      STEP {step.stepNumber}
                    </span>
                    <div
                      className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: isDark ? step.neonColor : step.lightAccentColor,
                        boxShadow: isActive || isSimActive ? `0 0 10px ${isDark ? step.neonColor : step.lightAccentColor}` : 'none',
                      }}
                    />
                  </div>

                  {/* Centered Icon */}
                  <div className="my-3.5 sm:my-4 flex justify-center">
                    <div className={`p-3.5 rounded-2xl transition-all duration-300 ${
                      isDark ? 'bg-[#0E1A30]/80' : 'bg-slate-50 border border-slate-100'
                    } group-hover:scale-105`}>
                      {step.icon(isDark)}
                    </div>
                  </div>

                  {/* Typography: Title & Subtitle */}
                  <div className="text-center">
                    <h3 className={`text-base font-bold tracking-tight mb-1 ${
                      isDark ? 'text-white' : 'text-[#0F172A]'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-xs font-mono font-semibold ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Active Packet Indicator when simulating */}
                  {isSimActive && (
                    <div className="mt-3 pt-2 border-t border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-500 text-center animate-pulse">
                      ⚡ TRANSMITTING
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Telemetry Drawer (Visible when a card is selected or simulated) */}
          {currentActiveStep && (
            <div className={`mt-4 p-5 rounded-2xl border transition-all duration-300 ${
              isDark
                ? 'bg-[#0B1528]/95 border-cyan-500/30 text-slate-200 shadow-xl'
                : 'bg-white/95 border-blue-200 shadow-sm text-slate-800'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                    NODE [{currentActiveStep.stepNumber}]: {currentActiveStep.title}
                  </span>
                  <span className={isDark ? 'text-slate-300 font-medium' : 'text-slate-700 font-medium'}>
                    — {currentActiveStep.telemetry.protocol}
                  </span>
                </div>
                <div className={`font-bold ${isDark ? 'text-[#38BDF8]' : 'text-blue-600'}`}>
                  {currentActiveStep.telemetry.latency}
                </div>
              </div>
              <div className={`mt-2 text-sm font-sans ${isDark ? 'text-slate-200' : 'text-slate-800 font-normal'}`}>
                {currentActiveStep.telemetry.description}
              </div>
              <div className={`mt-1 text-xs font-mono font-semibold ${isDark ? 'text-cyan-300' : 'text-blue-700'}`}>
                Stack: {currentActiveStep.telemetry.tech}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 5. UNIFIED ADAPTIVE DISCIPLINE CONTAINER (Horizontal Slide -> 3x2 Grid)   */}
        {/* ========================================================================= */}
        <div className="mb-14 sm:mb-18">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Code2 className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
              <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}>
                Engineering Sub-Disciplines
              </h2>
            </div>
            <span className="md:hidden text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Swipe cards →
            </span>
          </div>

          {/* 1 Adaptive Div that rearranges from Horizontal Snap Cards on Mobile to 3-Column Bento Grid on Laptop */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-4 sm:gap-5 no-scrollbar pb-2">
            {[...column1Disciplines, ...column2Disciplines, ...column3Disciplines].map((cat) => {
              const isHighlighted = activeStepId === cat.relatedStepId;
              return (
                <div
                  key={cat.id}
                  className={`snap-center shrink-0 w-[84vw] sm:w-[68vw] md:w-auto p-5 sm:p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between border ${
                    isDark
                      ? 'bg-[#0B1424]/85 backdrop-blur-md'
                      : 'bg-white/90 backdrop-blur-md shadow-xs'
                  } ${
                    isHighlighted
                      ? isDark
                        ? 'border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                        : 'border-blue-400 shadow-sm'
                      : isDark
                      ? 'border-white/10 hover:border-white/20'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Header with Icon and Badge */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl border ${
                          isDark
                            ? 'bg-[#101D33] border-white/10'
                            : 'bg-slate-50 border-slate-200'
                        }`}>
                          {cat.icon(isDark)}
                        </div>
                        <h3 className={`text-base font-bold tracking-tight ${
                          isDark ? 'text-white' : 'text-[#0F172A]'
                        }`}>
                          {cat.title}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                        isDark
                          ? 'bg-[#101D33] text-[#94A3B8] border-white/10'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {cat.accentBadge}
                      </span>
                    </div>

                    {/* Horizontal / Wrap Skill Spans inside each card */}
                    <div className={`pt-3 border-t flex flex-wrap gap-1.5 ${
                      isDark ? 'border-white/10' : 'border-slate-200/80'
                    }`}>
                      {cat.items.map((item, iIdx) => (
                        <span
                          key={iIdx}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium border ${
                            isDark
                              ? 'bg-[#0E1A30]/90 text-slate-200 border-blue-900/40'
                              : 'bg-slate-50 text-slate-700 border-slate-200/80'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isDark ? 'bg-cyan-400' : 'bg-blue-600'
                          }`} />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. THE JOURNEY / FLOW BREADCRUMBS & FOOTER CALLOUTS                       */}
        {/* ========================================================================= */}
        <div className="space-y-10">
          {/* Subtle Horizontal Breadcrumb Flow with "Business Logic" highlighted */}
          <div className={`relative py-4 px-3 sm:px-6 rounded-2xl border transition-colors ${
            isDark
              ? 'border-cyan-500/20 bg-[#0B1528]/80 backdrop-blur-md'
              : 'border-slate-200 bg-white/95 backdrop-blur-md shadow-sm'
          }`}>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-mono font-semibold">
              <span className={isDark ? 'text-white' : 'text-slate-800'}>
                Frontend
              </span>
              <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>→</span>

              <span className={isDark ? 'text-white' : 'text-slate-800'}>
                API
              </span>
              <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>→</span>

              {/* Highlighted Business Logic Pill */}
              <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 animate-pulse" />
                <span>Business Logic</span>
              </span>
              <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>→</span>

              <span className={isDark ? 'text-white' : 'text-slate-800'}>
                Database
              </span>
              <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>→</span>

              <span className={isDark ? 'text-white' : 'text-slate-800'}>
                Security
              </span>
              <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>→</span>

              <span className={isDark ? 'text-white' : 'text-slate-800'}>
                Deployment
              </span>
            </div>
          </div>

          {/* Two Clean Side-by-Side Callouts at Bottom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative">
            {/* Callout 1: Current Focus */}
            <div className={`p-5 sm:p-7 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 sm:gap-4 ${
              isDark
                ? 'bg-[#0B1424]/85 backdrop-blur-md border-white/10'
                : 'bg-white/95 backdrop-blur-md border-slate-200 shadow-sm'
            }`}>
              <div className={`p-2.5 sm:p-3 rounded-xl border flex-shrink-0 ${
                isDark
                  ? 'bg-[#101D33] border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-sky-50 border-sky-200 text-sky-700 shadow-sm'
              }`}>
                <Target className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className={`text-sm sm:text-base font-bold tracking-tight mb-1 ${
                  isDark ? 'text-cyan-400' : 'text-sky-700'
                }`}>
                  Current Focus
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${
                  isDark ? 'text-[#CBD5E1]' : 'text-[#334155]'
                }`}>
                  Hands-on projects, real-world implementation, and continuous improvement.
                </p>
              </div>
            </div>

            {/* Callout 2: Build with purpose */}
            <div className={`p-5 sm:p-7 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 sm:gap-4 ${
              isDark
                ? 'bg-[#0B1424]/85 backdrop-blur-md border-white/10'
                : 'bg-white/95 backdrop-blur-md border-slate-200 shadow-sm'
            }`}>
              <div className={`p-2.5 sm:p-3 rounded-xl border flex-shrink-0 ${
                isDark
                  ? 'bg-[#101D33] border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
              }`}>
                <MountainPeaksIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-1">
                <p className={`text-sm font-bold ${
                  isDark ? 'text-white' : 'text-[#0F172A]'
                }`}>
                  Build with purpose.
                </p>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                }`}>
                  Understand the architecture.
                </p>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
                }`}>
                  Keep improving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FullStackBlueprint;
