import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  ExperienceItem,
  ProjectItem,
  EducationItem,
  CertificationItem,
  LayoutSectionId,
  SectionLayoutConfig,
  CustomThemePalette,
  ResumeStudioConfig,
} from '../types';
import { PROFILE_DATA, EXPERIENCE_DATA, PROJECTS_DATA } from '../services/api';
import { useAuth } from './AuthContext';
import { ParsedResumeData } from '../utils/resumeParser';
import { findProfessionByLabel } from '../data/professionTaxonomy';

// 5 Built-in Section Layout Presets
export const LAYOUT_PRESETS: {
  id: string;
  name: string;
  description: string;
  order: LayoutSectionId[];
  visibility: Record<LayoutSectionId, boolean>;
}[] = [
  {
    id: 'standard-blueprint',
    name: '1. Standard Blueprint Flow',
    description: 'Hero → Blueprint → Experience → Projects → Education',
    order: ['hero', 'architecture', 'experience', 'projects', 'education'],
    visibility: { hero: true, architecture: true, experience: true, projects: true, education: true },
  },
  {
    id: 'projects-first',
    name: '2. Project Showcase First',
    description: 'Hero → Projects → Architecture → Experience → Education',
    order: ['hero', 'projects', 'architecture', 'experience', 'education'],
    visibility: { hero: true, architecture: true, experience: true, projects: true, education: true },
  },
  {
    id: 'experience-first',
    name: '3. Enterprise Experience First',
    description: 'Hero → Experience → Projects → Architecture → Education',
    order: ['hero', 'experience', 'projects', 'architecture', 'education'],
    visibility: { hero: true, architecture: true, experience: true, projects: true, education: true },
  },
  {
    id: 'academic-first',
    name: '4. Foundations & Academic First',
    description: 'Hero → Education → Experience → Projects → Architecture',
    order: ['hero', 'education', 'experience', 'projects', 'architecture'],
    visibility: { hero: true, architecture: true, experience: true, projects: true, education: true },
  },
  {
    id: 'executive-minimalist',
    name: '5. Executive Minimalist',
    description: 'Hero → Architecture → Projects → Experience (Education hidden)',
    order: ['hero', 'architecture', 'projects', 'experience', 'education'],
    visibility: { hero: true, architecture: true, experience: true, projects: true, education: false },
  },
];

// 5 Built-in Color Themes
export const COLOR_PRESETS: CustomThemePalette[] = [
  {
    id: 'glass-slate',
    name: 'Soft Glassmorphic Slate',
    canvasBg: '#ECF0F1',
    cardBg: '#FFFFFF',
    cardBorder: '#CBD5E1',
    accentColor: '#2563EB',
    headingColor: '#2C3D50',
    bodyTextColor: '#33495D',
  },
  {
    id: 'cyber-midnight',
    name: 'Deep Cyber Midnight',
    canvasBg: '#050A14',
    cardBg: '#0B1528',
    cardBorder: '#1E3A8A',
    accentColor: '#00D8FF',
    headingColor: '#FFFFFF',
    bodyTextColor: '#94A3B8',
  },
  {
    id: 'emerald-obsidian',
    name: 'Emerald Obsidian',
    canvasBg: '#071712',
    cardBg: '#0C241E',
    cardBorder: '#065F46',
    accentColor: '#10B981',
    headingColor: '#ECFDF5',
    bodyTextColor: '#A7F3D0',
  },
  {
    id: 'royal-amethyst',
    name: 'Royal Velvet Amethyst',
    canvasBg: '#0E071A',
    cardBg: '#170F2B',
    cardBorder: '#581C87',
    accentColor: '#A855F7',
    headingColor: '#FAF5FF',
    bodyTextColor: '#D8B4FE',
  },
  {
    id: 'minimal-charcoal',
    name: 'Minimalist Clean Light',
    canvasBg: '#F8FAFC',
    cardBg: '#FFFFFF',
    cardBorder: '#E2E8F0',
    accentColor: '#0284C7',
    headingColor: '#0F172A',
    bodyTextColor: '#475569',
  },
];

interface PortfolioDataState {
  profile: UserProfile;
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  layoutConfig: SectionLayoutConfig;
  customTheme: CustomThemePalette;
  resumeConfig: ResumeStudioConfig;
}

export type AdminTab =
  | 'autofill'
  | 'profile'
  | 'snapshot'
  | 'layout'
  | 'colors'
  | 'resume'
  | 'projects'
  | 'experience'
  | 'education'
  | 'backup'
  | 'account';

interface PortfolioDataContextType {
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  toggleAdminMode: () => void;

  // Resume Auto-Fill
  applyResumeAutofill: (data: ParsedResumeData) => void;

  // Profile
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  updateProfession: (profession: string, subProfession: string) => void;

  // Projects
  projects: ProjectItem[];
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, updated: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;

  // Experiences
  experiences: ExperienceItem[];
  addExperience: (exp: Omit<ExperienceItem, 'id'>) => void;
  updateExperience: (id: string, updated: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;

  // Education & Certifications
  education: EducationItem[];
  updateEducation: (edu: EducationItem[]) => void;
  addEducation: (item: EducationItem) => void;
  deleteEducation: (index: number) => void;

  certifications: CertificationItem[];
  updateCertifications: (certs: CertificationItem[]) => void;
  addCertification: (item: CertificationItem) => void;
  deleteCertification: (index: number) => void;

  // Layout & Arranging Divs
  layoutConfig: SectionLayoutConfig;
  applyLayoutPreset: (presetId: string) => void;
  moveSection: (sectionId: LayoutSectionId, direction: 'up' | 'down') => void;
  toggleSectionVisibility: (sectionId: LayoutSectionId) => void;

  // Multi-Color Customizer
  customTheme: CustomThemePalette;
  updateCustomTheme: (palette: Partial<CustomThemePalette>) => void;
  applyColorPreset: (presetId: string) => void;
  resetCustomTheme: () => void;

  // Blank Slate & Defaults
  startBlankPortfolio: () => void;
  resetToDefaults: () => void;

  // Resume Studio
  resumeConfig: ResumeStudioConfig;
  updateResumeConfig: (cfg: Partial<ResumeStudioConfig>) => void;
  downloadFormattedResume: () => void;

  // Resume Heist Animation & Modal
  isResumeHeistOpen: boolean;
  openResumeHeist: () => void;
  closeResumeHeist: () => void;

  // One Shot View Cinematic Journey Modal
  isOneShotOpen: boolean;
  openOneShot: () => void;
  closeOneShot: () => void;

  // Admin Modal Controls
  isAdminModalOpen: boolean;
  adminModalTab: AdminTab;
  openAdminModal: (tab?: AdminTab) => void;
  closeAdminModal: () => void;

  // Specific Item Editing
  editingProjectId: string | null;
  setEditingProjectId: (id: string | null) => void;
  editingExperienceId: string | null;
  setEditingExperienceId: (id: string | null) => void;

  // Backup & Import/Export
  exportDataJson: () => void;
  importDataJson: (jsonString: string) => boolean;
}

const PUBLIC_STORAGE_KEY = 'abhay_portfolio_data_public_v2';
const ADMIN_MODE_KEY = 'abhay_portfolio_admin_mode';

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();

  // Storage key is dynamic per user account for multi-user isolation
  const getStorageKey = () => {
    return currentUser ? `abhay_portfolio_data_user_${currentUser.id}` : PUBLIC_STORAGE_KEY;
  };

  const cleanProfile = (rawProfile: any): UserProfile => {
    const merged = { ...PROFILE_DATA, ...(rawProfile || {}) };
    if (!merged.headline || merged.headline === 'Building end-to-end applications with Java & React.') {
      merged.headline = 'Backend Developer | Full Stack Developer | Gen AI';
    }
    if (merged.statusMessage === 'Associate Software Engineer Candidate · Indore, MP') {
      merged.statusMessage = '';
    }
    if (merged.locationPreference === 'Indore, MP / Remote') {
      merged.locationPreference = 'Open to Relocation / Remote';
    }
    return {
      ...merged,
      avatarUrl: typeof rawProfile?.avatarUrl === 'string' ? rawProfile.avatarUrl : PROFILE_DATA.avatarUrl,
      photoFilter: rawProfile?.photoFilter || PROFILE_DATA.photoFilter || 'smooth',
    };
  };

  const defaultInitialState: PortfolioDataState = {
    profile: PROFILE_DATA,
    experiences: EXPERIENCE_DATA,
    projects: PROJECTS_DATA,
    layoutConfig: {
      activePreset: 'standard-blueprint',
      order: ['hero', 'architecture', 'experience', 'projects', 'education'],
      visibility: { hero: true, architecture: true, experience: true, projects: true, education: true },
    },
    customTheme: COLOR_PRESETS[1], // default Cyber Midnight / Slate
    resumeConfig: {
      accentColor: '#2563EB',
      fontFamily: 'sans',
      customSummary: PROFILE_DATA.bio,
      lastUpdated: new Date().toISOString(),
    },
  };

  const [data, setData] = useState<PortfolioDataState>(() => {
    try {
      const saved = localStorage.getItem(PUBLIC_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          profile: cleanProfile(parsed.profile),
          experiences: parsed.experiences && parsed.experiences.length > 0 ? parsed.experiences : EXPERIENCE_DATA,
          projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : PROJECTS_DATA,
          layoutConfig: parsed.layoutConfig || defaultInitialState.layoutConfig,
          customTheme: parsed.customTheme || defaultInitialState.customTheme,
          resumeConfig: parsed.resumeConfig || defaultInitialState.resumeConfig,
        };
      }
    } catch (e) {
      console.warn('Failed to parse portfolio data, using defaults', e);
    }
    return defaultInitialState;
  });

  // Re-load data when active user changes (multi-user relational switch)
  useEffect(() => {
    if (!currentUser) {
      // Logged out / Public visitor mode: load public data or default initial
      try {
        const saved = localStorage.getItem(PUBLIC_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setData({
            profile: cleanProfile(parsed.profile),
            experiences: parsed.experiences && parsed.experiences.length > 0 ? parsed.experiences : EXPERIENCE_DATA,
            projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : PROJECTS_DATA,
            layoutConfig: parsed.layoutConfig || defaultInitialState.layoutConfig,
            customTheme: parsed.customTheme || defaultInitialState.customTheme,
            resumeConfig: parsed.resumeConfig || defaultInitialState.resumeConfig,
          });
          setIsAdminMode(false);
          return;
        }
      } catch {
        // ignore
      }
      setData(defaultInitialState);
      setIsAdminMode(false);
      return;
    }

    // Authenticated user mode: load user's private storage key
    const isSiteAdmin =
      currentUser.id === 'admin_abhay_gupta' ||
      currentUser.id === 'user_admin_abhay' ||
      currentUser.email.toLowerCase() === 'gupta.abhayit@gmail.com';

    setIsAdminMode(true);

    const userStorageKey = `abhay_portfolio_data_user_${currentUser.id}`;
    const taxItem = findProfessionByLabel(currentUser.profession);
    const chosenRole = currentUser.subProfession || taxItem.subFields[0];

    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData({
          profile: {
            ...PROFILE_DATA,
            ...(parsed.profile || {}),
            avatarUrl: typeof parsed.profile?.avatarUrl === 'string' ? parsed.profile.avatarUrl : PROFILE_DATA.avatarUrl,
            photoFilter: parsed.profile?.photoFilter || PROFILE_DATA.photoFilter || 'smooth',
            profession: parsed.profile?.profession || currentUser.profession || taxItem.label,
            subProfession: parsed.profile?.subProfession || currentUser.subProfession || chosenRole,
            education:
              Array.isArray(parsed.profile?.education) && parsed.profile.education.length > 0
                ? parsed.profile.education
                : (isSiteAdmin ? PROFILE_DATA.education : []),
            certifications:
              Array.isArray(parsed.profile?.certifications) && parsed.profile.certifications.length > 0
                ? parsed.profile.certifications
                : (isSiteAdmin ? PROFILE_DATA.certifications : []),
          },
          experiences:
            parsed.experiences && parsed.experiences.length > 0
              ? parsed.experiences
              : (isSiteAdmin ? EXPERIENCE_DATA : []),
          projects:
            parsed.projects && parsed.projects.length > 0
              ? parsed.projects
              : (isSiteAdmin ? PROJECTS_DATA : []),
          layoutConfig: parsed.layoutConfig || defaultInitialState.layoutConfig,
          customTheme: parsed.customTheme || defaultInitialState.customTheme,
          resumeConfig: parsed.resumeConfig || defaultInitialState.resumeConfig,
        });
        return;
      }
    } catch {
      // ignore
    }

    // New user with no saved data yet:
    if (isSiteAdmin) {
      setData(defaultInitialState);
      try {
        localStorage.setItem(userStorageKey, JSON.stringify(defaultInitialState));
      } catch {}
    } else {
      // Other registered users get their own clean personalized portfolio based on their selected profession
      const personalizedInitialState: PortfolioDataState = {
        ...defaultInitialState,
        profile: {
          name: currentUser.email.split('@')[0],
          email: currentUser.email,
          title: chosenRole,
          profession: currentUser.profession || taxItem.label,
          subProfession: chosenRole,
          headline: `Experienced ${chosenRole} dedicated to excellence and measurable results.`,
          bio: `Professional portfolio managed by ${currentUser.email}.`,
          summary: `Seeking high-impact opportunities in ${chosenRole}.`,
          location: 'Remote / Global',
          phone: currentUser.mobileNumber || '+91 00000 00000',
          githubUrl: 'https://github.com',
          linkedinUrl: 'https://linkedin.com',
          availableForHire: true,
          statusMessage: `${chosenRole} · Ready for Hire`,
          primarySkills: [chosenRole],
          education: [],
          certifications: [],
          snapshotFocus: `${taxItem.label.split('(')[0].trim()} Focus`,
          snapshotBadge: 'VERIFIED',
          targetRole: chosenRole,
          backendTech: taxItem.defaultAttributes.attr1Default,
          frontendTech: taxItem.defaultAttributes.attr2Default,
          databases: taxItem.defaultAttributes.attr3Default,
          internshipsSummary: '',
          educationSummary: '',
          workType: 'Full-Time / Contract',
          locationPreference: 'Remote / Hybrid',
        },
        experiences: [],
        projects: [],
      };
      setData(personalizedInitialState);
      try {
        localStorage.setItem(userStorageKey, JSON.stringify(personalizedInitialState));
      } catch {}
    }
  }, [currentUser]);

  // Admin Mode state
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_MODE_KEY);
      if (saved !== null) return saved === 'true';
    } catch {
      // ignore
    }
    return false;
  });

  // Master Admin Modal state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminModalTab, setAdminModalTab] = useState<AdminTab>('profile');

  // Resume Heist Interactive Modal state
  const [isResumeHeistOpen, setIsResumeHeistOpen] = useState(false);
  const openResumeHeist = () => setIsResumeHeistOpen(true);
  const closeResumeHeist = () => setIsResumeHeistOpen(false);

  // One Shot View Cinematic Journey state
  const [isOneShotOpen, setIsOneShotOpen] = useState(false);
  const openOneShot = () => setIsOneShotOpen(true);
  const closeOneShot = () => setIsOneShotOpen(false);

  // Direct editing IDs
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);

  // Sync to localStorage whenever data or user changes
  useEffect(() => {
    try {
      const key = getStorageKey();
      localStorage.setItem(key, JSON.stringify(data));

      // If current user is primary site owner, also update the public visitor storage
      if (
        currentUser?.id === 'user_admin_abhay' ||
        currentUser?.email.toLowerCase() === 'gupta.abhayit@gmail.com'
      ) {
        localStorage.setItem(PUBLIC_STORAGE_KEY, JSON.stringify(data));
      }
    } catch (e) {
      console.error('Failed to save portfolio data to localStorage', e);
    }
  }, [data, currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_MODE_KEY, String(isAdminMode));
    } catch {
      // ignore
    }
  }, [isAdminMode]);

  // Auth gate wrapper for Admin mode
  const toggleAdminMode = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    const nextMode = !isAdminMode;
    setIsAdminMode(nextMode);
    if (nextMode) {
      setAdminModalTab('profile');
      setIsAdminModalOpen(true);
    }
  };

  const openAdminModal = (tab: AdminTab = 'profile') => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setAdminModalTab(tab);
    setIsAdminModalOpen(true);
  };

  const closeAdminModal = () => {
    setIsAdminModalOpen(false);
  };

  // Apply Resume Auto-Fill
  const applyResumeAutofill = (parsed: ParsedResumeData) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        name: parsed.name || prev.profile.name,
        title: parsed.title || prev.profile.title,
        email: parsed.email || prev.profile.email,
        phone: parsed.phone || prev.profile.phone,
        location: parsed.location || prev.profile.location,
        githubUrl: parsed.githubUrl || prev.profile.githubUrl,
        linkedinUrl: parsed.linkedinUrl || prev.profile.linkedinUrl,
        portfolioUrl: parsed.portfolioUrl || prev.profile.portfolioUrl,
        bio: parsed.bio || prev.profile.bio,
        summary: parsed.summary || prev.profile.summary,
        primarySkills:
          parsed.primarySkills && parsed.primarySkills.length > 0
            ? parsed.primarySkills
            : prev.profile.primarySkills,
        backendTech: parsed.backendTech || prev.profile.backendTech,
        frontendTech: parsed.frontendTech || prev.profile.frontendTech,
        databases: parsed.databases || prev.profile.databases,
        targetRole: parsed.targetRole || prev.profile.targetRole,
        workType: parsed.workType || prev.profile.workType,
        education:
          parsed.education && parsed.education.length > 0
            ? parsed.education
            : prev.profile.education,
        certifications:
          parsed.certifications && parsed.certifications.length > 0
            ? parsed.certifications
            : prev.profile.certifications,
      },
      experiences:
        parsed.experiences && parsed.experiences.length > 0 ? parsed.experiences : prev.experiences,
      projects:
        parsed.projects && parsed.projects.length > 0 ? parsed.projects : prev.projects,
    }));
  };

  // Profile update
  const updateProfile = (updated: Partial<UserProfile>) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updated },
    }));
  };

  const updateProfession = (profession: string, subProfession: string) => {
    const taxonomyItem = findProfessionByLabel(profession);
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        profession,
        subProfession,
        title: subProfession || prev.profile.title,
        targetRole: subProfession || prev.profile.targetRole,
        snapshotFocus: `${taxonomyItem.label.split('(')[0].trim()} Focus`,
        backendTech: taxonomyItem.defaultAttributes.attr1Default,
        frontendTech: taxonomyItem.defaultAttributes.attr2Default,
        databases: taxonomyItem.defaultAttributes.attr3Default,
      },
    }));
  };

  // Projects CRUD
  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    const newProj: ProjectItem = {
      ...project,
      id: `proj-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
  };

  const updateProject = (id: string, updated: Partial<ProjectItem>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    }));
  };

  const deleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // Experience CRUD
  const addExperience = (exp: Omit<ExperienceItem, 'id'>) => {
    const newExp: ExperienceItem = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences],
    }));
  };

  const updateExperience = (id: string, updated: Partial<ExperienceItem>) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, ...updated } : e)),
    }));
  };

  const deleteExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  // Education CRUD
  const updateEducation = (eduList: EducationItem[]) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, education: eduList },
    }));
  };

  const addEducation = (item: EducationItem) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        education: [item, ...prev.profile.education],
      },
    }));
  };

  const deleteEducation = (index: number) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        education: prev.profile.education.filter((_, idx) => idx !== index),
      },
    }));
  };

  // Certifications CRUD
  const updateCertifications = (certsList: CertificationItem[]) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, certifications: certsList },
    }));
  };

  const addCertification = (item: CertificationItem) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        certifications: [item, ...prev.profile.certifications],
      },
    }));
  };

  const deleteCertification = (index: number) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        certifications: prev.profile.certifications.filter((_, idx) => idx !== index),
      },
    }));
  };

  // Layout & Arranging Divs
  const applyLayoutPreset = (presetId: string) => {
    const preset = LAYOUT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setData((prev) => ({
        ...prev,
        layoutConfig: {
          activePreset: preset.id,
          order: [...preset.order],
          visibility: { ...preset.visibility },
        },
      }));
    }
  };

  const moveSection = (sectionId: LayoutSectionId, direction: 'up' | 'down') => {
    setData((prev) => {
      const order = [...prev.layoutConfig.order];
      const index = order.indexOf(sectionId);
      if (index === -1) return prev;

      if (direction === 'up' && index > 0) {
        const temp = order[index - 1];
        order[index - 1] = order[index];
        order[index] = temp;
      } else if (direction === 'down' && index < order.length - 1) {
        const temp = order[index + 1];
        order[index + 1] = order[index];
        order[index] = temp;
      }

      return {
        ...prev,
        layoutConfig: {
          ...prev.layoutConfig,
          activePreset: 'custom',
          order,
        },
      };
    });
  };

  const toggleSectionVisibility = (sectionId: LayoutSectionId) => {
    setData((prev) => ({
      ...prev,
      layoutConfig: {
        ...prev.layoutConfig,
        visibility: {
          ...prev.layoutConfig.visibility,
          [sectionId]: !prev.layoutConfig.visibility[sectionId],
        },
      },
    }));
  };

  // Multi-Color Theme Studio
  const updateCustomTheme = (palette: Partial<CustomThemePalette>) => {
    setData((prev) => ({
      ...prev,
      customTheme: { ...prev.customTheme, ...palette },
    }));
  };

  const applyColorPreset = (presetId: string) => {
    const preset = COLOR_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setData((prev) => ({
        ...prev,
        customTheme: { ...preset },
      }));
    }
  };

  const resetCustomTheme = () => {
    setData((prev) => ({
      ...prev,
      customTheme: COLOR_PRESETS[0],
    }));
  };

  // Blank Slate: wipe every field so user can enter everything cleanly from zero
  const startBlankPortfolio = () => {
    setData((prev) => ({
      ...prev,
      profile: {
        name: currentUser ? currentUser.email.split('@')[0] : 'Your Name',
        title: 'Full Stack Developer',
        headline: 'Building modern web applications.',
        bio: 'Write your professional summary here...',
        summary: '',
        email: currentUser ? currentUser.email : '',
        phone: '',
        location: 'City, Country',
        githubUrl: 'https://github.com/',
        linkedinUrl: 'https://linkedin.com/in/',
        availableForHire: true,
        statusMessage: 'Available for new opportunities',
        primarySkills: ['Java', 'React', 'SQL'],
        education: [],
        certifications: [],
        snapshotFocus: 'Developer Focus',
        snapshotBadge: 'ACTIVE',
        targetRole: 'Software Engineer',
        backendTech: 'Backend Stack',
        frontendTech: 'Frontend Stack',
        databases: 'Databases',
        internshipsSummary: 'Experience summary',
        educationSummary: 'Education summary',
        workType: 'Full-Time',
        locationPreference: 'Remote / On-Site',
      },
      experiences: [],
      projects: [],
    }));
  };

  // Reset to original Abhay Gupta verified template
  const resetToDefaults = () => {
    setData(defaultInitialState);
    const key = getStorageKey();
    localStorage.removeItem(key);
  };

  // Resume Studio
  const updateResumeConfig = (cfg: Partial<ResumeStudioConfig>) => {
    setData((prev) => ({
      ...prev,
      resumeConfig: { ...prev.resumeConfig, ...cfg, lastUpdated: new Date().toISOString() },
    }));
  };

  const downloadFormattedResume = () => {
    const { profile, experiences, projects, customTheme, resumeConfig } = data;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up was blocked. Please allow pop-ups to download or print your formatted resume.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${profile.name} — Résumé</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: ${resumeConfig.fontFamily === 'serif' ? 'Georgia, serif' : resumeConfig.fontFamily === 'mono' ? 'Courier New, monospace' : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
            background: #ffffff;
            color: #1f2937;
            padding: 40px;
            max-width: 850px;
            margin: 0 auto;
            line-height: 1.5;
          }
          .header { border-bottom: 3px solid ${resumeConfig.accentColor}; padding-bottom: 18px; margin-bottom: 24px; }
          .header h1 { font-size: 28px; color: ${resumeConfig.accentColor}; font-weight: 800; }
          .header h2 { font-size: 16px; color: #4b5563; margin-top: 4px; font-weight: 600; }
          .contact-bar { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 10px; font-size: 13px; color: #6b7280; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; color: ${resumeConfig.accentColor}; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 12px; }
          .summary { font-size: 14px; color: #374151; line-height: 1.6; }
          .skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
          .skill-pill { background: #f3f4f6; color: #1f2937; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; border: 1px solid #e5e7eb; }
          .item { margin-bottom: 16px; }
          .item-top { display: flex; justify-content: space-between; align-items: baseline; }
          .item-title { font-size: 15px; font-weight: 700; color: #111827; }
          .item-sub { font-size: 13px; font-weight: 600; color: ${resumeConfig.accentColor}; }
          .item-date { font-size: 12px; color: #6b7280; font-family: monospace; }
          .item-desc { font-size: 13px; color: #4b5563; margin-top: 5px; }
          ul.bullets { margin-left: 20px; margin-top: 6px; font-size: 13px; color: #4b5563; }
          ul.bullets li { margin-bottom: 4px; }
          @media print {
            body { padding: 20px; }
            @page { margin: 15mm; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${profile.name}</h1>
          <h2>${profile.title}</h2>
          <div class="contact-bar">
            <span>📍 ${profile.location}</span>
            <span>✉️ ${profile.email}</span>
            <span>📱 ${profile.phone}</span>
            <span>🐙 ${profile.githubUrl}</span>
            <span>🔗 ${profile.linkedinUrl}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Professional Summary</div>
          <p class="summary">${resumeConfig.customSummary || profile.bio}</p>
        </div>

        <div class="section">
          <div class="section-title">Core Technical Skills</div>
          <div class="skills-wrap">
            ${profile.primarySkills.map((s) => `<span class="skill-pill">${s}</span>`).join('')}
          </div>
        </div>

        ${
          experiences.length > 0
            ? `
          <div class="section">
            <div class="section-title">Professional Experience & Internships</div>
            ${experiences
              .map(
                (exp) => `
              <div class="item">
                <div class="item-top">
                  <span class="item-title">${exp.role}</span>
                  <span class="item-date">${exp.period}</span>
                </div>
                <div class="item-sub">${exp.company} — ${exp.location}</div>
                <ul class="bullets">
                  ${exp.highlights.map((h) => `<li>${h}</li>`).join('')}
                </ul>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }

        ${
          projects.length > 0
            ? `
          <div class="section">
            <div class="section-title">Featured Projects</div>
            ${projects
              .map(
                (p) => `
              <div class="item">
                <div class="item-top">
                  <span class="item-title">${p.title}</span>
                  <span class="item-date">${p.category}</span>
                </div>
                <div class="item-desc">${p.description}</div>
                <div style="font-size: 12px; margin-top: 4px; color: #6b7280;">Stack: ${p.tags.join(', ')}</div>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }

        ${
          profile.education.length > 0
            ? `
          <div class="section">
            <div class="section-title">Education</div>
            ${profile.education
              .map(
                (edu) => `
              <div class="item">
                <div class="item-top">
                  <span class="item-title">${edu.degree}</span>
                  <span class="item-date">${edu.period}</span>
                </div>
                <div class="item-sub">${edu.institution} — ${edu.location}</div>
                ${edu.details ? `<div class="item-desc">${edu.details}</div>` : ''}
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  // Export as downloadable JSON
  const exportDataJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${data.profile.name.toLowerCase().replace(/\s+/g, '_')}_portfolio_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import from JSON
  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile && parsed.projects && parsed.experiences) {
        setData({
          profile: parsed.profile,
          experiences: parsed.experiences,
          projects: parsed.projects,
          layoutConfig: parsed.layoutConfig || defaultInitialState.layoutConfig,
          customTheme: parsed.customTheme || defaultInitialState.customTheme,
          resumeConfig: parsed.resumeConfig || defaultInitialState.resumeConfig,
        });
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON file', e);
    }
    return false;
  };

  return (
    <PortfolioDataContext.Provider
      value={{
        isAdminMode,
        setIsAdminMode,
        toggleAdminMode,

        applyResumeAutofill,

        profile: data.profile,
        updateProfile,
        updateProfession,

        projects: data.projects,
        addProject,
        updateProject,
        deleteProject,

        experiences: data.experiences,
        addExperience,
        updateExperience,
        deleteExperience,

        education: data.profile.education,
        updateEducation,
        addEducation,
        deleteEducation,

        certifications: data.profile.certifications,
        updateCertifications,
        addCertification,
        deleteCertification,

        layoutConfig: data.layoutConfig,
        applyLayoutPreset,
        moveSection,
        toggleSectionVisibility,

        customTheme: data.customTheme,
        updateCustomTheme,
        applyColorPreset,
        resetCustomTheme,

        startBlankPortfolio,
        resetToDefaults,

        resumeConfig: data.resumeConfig,
        updateResumeConfig,
        downloadFormattedResume,

        isResumeHeistOpen,
        openResumeHeist,
        closeResumeHeist,

        isOneShotOpen,
        openOneShot,
        closeOneShot,

        isAdminModalOpen,
        adminModalTab,
        openAdminModal,
        closeAdminModal,

        editingProjectId,
        setEditingProjectId,
        editingExperienceId,
        setEditingExperienceId,

        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = (): PortfolioDataContextType => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
};
