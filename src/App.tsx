import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PortfolioDataProvider, usePortfolioData } from './context/PortfolioDataContext';
import { LayoutSectionId } from './types';
import { Navbar } from './components/common/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { FullStackBlueprint } from './components/architecture/FullStackBlueprint';
import { ExperienceSection } from './components/experience/ExperienceSection';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { EducationSection } from './components/education/EducationSection';
import { Footer } from './components/footer/Footer';
import { AdminModal } from './components/admin/AdminModal';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminFloatingBar } from './components/admin/AdminFloatingBar';
import { ResumeHeistModal } from './components/resume/ResumeHeistModal';
import { InteractiveProfileBackground } from './components/common/InteractiveProfileBackground';

const PortfolioContent: React.FC = () => {
  const { isDark } = useTheme();
  const { layoutConfig, customTheme } = usePortfolioData();

  // Dynamic map of layout sections
  const sectionMap: Record<LayoutSectionId, React.ReactNode> = {
    hero: <HeroSection key="hero" />,
    architecture: <FullStackBlueprint key="architecture" />,
    experience: <ExperienceSection key="experience" />,
    projects: <ProjectsSection key="projects" />,
    education: <EducationSection key="education" />,
  };

  return (
    <div
      className={`relative min-h-screen font-sans transition-colors duration-500 selection:bg-blue-600/30 selection:text-white ${
        isDark ? 'bg-[#050A14] text-[#E2E8F0]' : 'bg-[#F8FAFD] text-[#0F172A]'
      }`}
      style={{
        // Dynamic custom color theme application
        accentColor: customTheme.accentColor,
      }}
    >
      {/* Full-Page Mode-Aware Interactive Background */}
      <InteractiveProfileBackground />

      <Navbar />

      <main className="relative z-10">
        {/* Render sections in the user's arranged sequence */}
        {layoutConfig.order
          .filter((sectionId) => layoutConfig.visibility[sectionId] !== false)
          .map((sectionId) => sectionMap[sectionId])}
      </main>

      <Footer />

      {/* Admin Login Gate Modal (Simple Login, Password Change, Recovery) */}
      <AdminAuthModal />

      {/* Master Admin Modal & Floating Controls */}
      <AdminModal />
      <AdminFloatingBar />

      {/* Playful Thief Resume Heist Interactive Modal */}
      <ResumeHeistModal />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioDataProvider>
          <PortfolioContent />
        </PortfolioDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
