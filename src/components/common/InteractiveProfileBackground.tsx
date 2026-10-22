import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const InteractiveProfileBackground: React.FC = () => {
  const { isDark } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const x = Math.round((e.clientX / window.innerWidth) * 100);
        const y = Math.round((e.clientY / window.innerHeight) * 100);
        setMousePos({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-500">
      {/* 1. Base Adaptive Solid-to-Gradient Canvas */}
      {isDark ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#040814] via-[#070E20] to-[#040916]" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFCFF] via-[#F4F7FC] to-[#EDF2FA]" />
      )}

      {/* 2. Engineering Dot-Matrix Grid (Crisp in both Dark and Light modes) */}
      <div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(100, 116, 139, 0.18) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: isDark ? 0.7 : 0.8,
        }}
      />

      {/* 3. Interactive Cursor Glow Follower */}
      <div
        className="absolute rounded-full transition-all duration-700 ease-out will-change-transform blur-[100px] pointer-events-none"
        style={{
          width: '580px',
          height: '580px',
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: 'translate(-50%, -50%)',
          background: isDark
            ? 'radial-gradient(circle, rgba(6,182,212,0.22) 0%, rgba(59,130,246,0.18) 40%, rgba(147,51,234,0.08) 70%, transparent 100%)'
            : 'radial-gradient(circle, rgba(37,99,235,0.16) 0%, rgba(56,189,248,0.14) 45%, rgba(168,85,247,0.06) 70%, transparent 100%)',
        }}
      />

      {/* 4. Ambient Aura Glow Orbs (Soft, non-obtrusive, perfectly balanced) */}
      {/* Top-Right Ambient Halo */}
      <div
        className="absolute -top-28 -right-20 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(124,58,237,0.15) 50%, transparent 80%)'
            : 'radial-gradient(circle, rgba(186,230,253,0.7) 0%, rgba(219,234,254,0.6) 50%, transparent 80%)',
          opacity: isDark ? 0.75 : 0.85,
        }}
      />

      {/* Center-Left Ambient Halo */}
      <div
        className="absolute top-1/3 -left-36 w-[650px] h-[650px] rounded-full blur-[150px] pointer-events-none transition-all duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(6,182,212,0.20) 0%, rgba(16,185,129,0.10) 60%, transparent 85%)'
            : 'radial-gradient(circle, rgba(199,210,254,0.65) 0%, rgba(224,231,255,0.5) 60%, transparent 85%)',
          opacity: isDark ? 0.7 : 0.8,
        }}
      />

      {/* Bottom-Right Ambient Warm Glow */}
      <div
        className="absolute -bottom-20 right-1/4 w-[600px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-all duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(99,102,241,0.16) 0%, rgba(217,70,239,0.12) 50%, transparent 80%)'
            : 'radial-gradient(circle, rgba(254,215,170,0.5) 0%, rgba(245,208,254,0.4) 50%, transparent 80%)',
          opacity: isDark ? 0.6 : 0.7,
        }}
      />

      {/* 5. Minimal Corner Dev Circuit Accents (Kept subtle and away from text) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700"
        style={{ opacity: isDark ? 0.35 : 0.25 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="traceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#38BDF8' : '#2563EB'} stopOpacity="0.8" />
            <stop offset="100%" stopColor={isDark ? '#818CF8' : '#4F46E5'} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Subtle decorative top-left circuit node */}
        <path
          d="M 20 60 L 80 60 L 120 100 L 220 100"
          stroke="url(#traceGrad)"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="4 6"
        />
        <circle cx="20" cy="60" r="3" fill={isDark ? '#38BDF8' : '#2563EB'} />
        <circle cx="220" cy="100" r="2.5" fill={isDark ? '#818CF8' : '#4F46E5'} />

        {/* Subtle decorative top-right circuit node */}
        <path
          d="M 98% 80 L 92% 80 L 88% 120 L 80% 120"
          stroke="url(#traceGrad)"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="5 7"
        />
        <circle cx="98%" cy="80" r="3" fill={isDark ? '#38BDF8' : '#2563EB'} />
      </svg>
    </div>
  );
};
