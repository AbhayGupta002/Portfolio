import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const InteractiveProfileBackground: React.FC = () => {
  const { isDark } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse coords (%)
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-700">
      {/* 1. Base Gradient Canvas */}
      {isDark ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#050A14] via-[#081224] to-[#040812]" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFD] via-[#F1F5F9] to-[#E8EEF5]" />
      )}

      {/* 2. Interactive Mouse Follower Radial Glow Orb */}
      <div
        className="absolute rounded-full transition-transform duration-500 ease-out will-change-transform blur-3xl opacity-60 dark:opacity-40"
        style={{
          width: '550px',
          height: '550px',
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: 'translate(-50%, -50%)',
          background: isDark
            ? 'radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(6,182,212,0.2) 40%, rgba(147,51,234,0.08) 70%, transparent 100%)'
            : 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(56,189,248,0.18) 40%, rgba(99,102,241,0.08) 70%, transparent 100%)',
        }}
      />

      {/* 3. Ambient Static Aura Orbs (Deep Depth of Field) */}
      <div
        className="absolute -top-32 -right-20 w-[550px] h-[550px] rounded-full blur-[120px] opacity-70 transition-colors duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(37,99,235,0.3) 0%, rgba(124,58,237,0.2) 50%, transparent 80%)'
            : 'radial-gradient(circle, rgba(147,197,253,0.45) 0%, rgba(199,210,254,0.35) 50%, transparent 80%)',
        }}
      />
      <div
        className="absolute top-1/3 -left-32 w-[600px] h-[600px] rounded-full blur-[130px] opacity-60 transition-colors duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, rgba(16,185,129,0.12) 60%, transparent 85%)'
            : 'radial-gradient(circle, rgba(165,243,252,0.45) 0%, rgba(187,247,208,0.3) 60%, transparent 85%)',
        }}
      />
      <div
        className="absolute -bottom-24 right-1/4 w-[650px] h-[500px] rounded-full blur-[130px] opacity-65 transition-colors duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, rgba(217,70,239,0.18) 45%, transparent 80%)'
            : 'radial-gradient(circle, rgba(254,215,170,0.5) 0%, rgba(245,208,254,0.35) 50%, transparent 80%)',
        }}
      />

      {/* 4. Architectural Software Engineering Matrix Grid */}
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.065] transition-opacity duration-500"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(to right, #38BDF8 1px, transparent 1px), linear-gradient(to bottom, #38BDF8 1px, transparent 1px)'
            : 'linear-gradient(to right, #0F172A 1px, transparent 1px), linear-gradient(to bottom, #0F172A 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* 5. Subtle Architectural Circuit / Node Network Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.16] dark:opacity-[0.24] transition-opacity duration-700"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gridBeamGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="gridBeamGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#9333EA" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Diagonal Circuit Lines */}
        <line
          x1="5%"
          y1="10%"
          x2="45%"
          y2="50%"
          stroke={isDark ? 'url(#gridBeamGradDark)' : 'url(#gridBeamGradLight)'}
          strokeWidth="1.2"
          strokeDasharray="6 8"
        />
        <line
          x1="95%"
          y1="15%"
          x2="55%"
          y2="60%"
          stroke={isDark ? 'url(#gridBeamGradDark)' : 'url(#gridBeamGradLight)'}
          strokeWidth="1.2"
          strokeDasharray="8 10"
        />
        <line
          x1="20%"
          y1="85%"
          x2="70%"
          y2="35%"
          stroke={isDark ? 'url(#gridBeamGradDark)' : 'url(#gridBeamGradLight)'}
          strokeWidth="1"
          strokeDasharray="4 8"
        />

        {/* Engineering System Anchor Dots */}
        <circle cx="5%" cy="10%" r="3.5" fill={isDark ? '#38BDF8' : '#2563EB'} fillOpacity="0.6" />
        <circle cx="45%" cy="50%" r="4" fill={isDark ? '#00D8FF' : '#0284C7'} fillOpacity="0.8" />
        <circle cx="95%" cy="15%" r="3" fill={isDark ? '#C084FC' : '#9333EA'} fillOpacity="0.6" />
        <circle cx="55%" cy="60%" r="3.5" fill={isDark ? '#34D399' : '#10B981'} fillOpacity="0.7" />
      </svg>

      {/* 6. Soft Studio Vignette Edge Softener */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(3,7,18,0.7) 100%)'
            : 'radial-gradient(circle at 50% 50%, transparent 65%, rgba(226,232,240,0.5) 100%)',
        }}
      />
    </div>
  );
};
