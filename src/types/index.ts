export interface UserProfile {
  name: string;
  title: string;
  headline?: string;
  bio: string;
  summary: string;
  email: string;
  location: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl?: string;
  availableForHire: boolean;
  statusMessage: string;
  primarySkills: string[];
  education: EducationItem[];
  certifications: CertificationItem[];

  // Photo & Visual Customization
  avatarUrl?: string;
  photoFilter?: 'smooth' | 'luminous' | 'original';
  photoBrightness?: number;
  photoContrast?: number;

  // Profession & Specialization (Global Taxonomy)
  profession?: string;
  subProfession?: string;

  // Engineering Snapshot Card fields (Hero right card)
  snapshotFocus?: string;
  snapshotBadge?: string;
  targetRole?: string;
  backendTech?: string;
  frontendTech?: string;
  databases?: string;
  internshipsSummary?: string;
  educationSummary?: string;
  workType?: string;
  locationPreference?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
  techStack: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  metrics: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  location: string;
  details?: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  year?: string;
  description: string;
  badge?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  needsPasswordChange: boolean;
  mobileNumber: string;
  secretUsernameHash: string;
  portfolioId: string;
  profession?: string;
  subProfession?: string;
  isProfessionSetupComplete?: boolean;
  createdAt: string;
}

export type LayoutSectionId = 'hero' | 'architecture' | 'experience' | 'projects' | 'education';

export interface SectionLayoutConfig {
  activePreset: string;
  order: LayoutSectionId[];
  visibility: Record<LayoutSectionId, boolean>;
}

export interface CustomThemePalette {
  id: string;
  name: string;
  canvasBg: string;
  cardBg: string;
  cardBorder: string;
  accentColor: string;
  headingColor: string;
  bodyTextColor: string;
}

export interface ResumeStudioConfig {
  accentColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  customSummary?: string;
  lastUpdated: string;
}
