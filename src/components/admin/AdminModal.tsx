import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Check,
  ExternalLink,
  Briefcase,
  GraduationCap,
  FolderKanban,
  User,
  Terminal,
  Layers,
  Palette,
  FileText,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ShieldCheck,
  LogOut,
  Printer,
  Sparkles,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import { usePortfolioData, AdminTab, LAYOUT_PRESETS, COLOR_PRESETS } from '../../context/PortfolioDataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ProjectItem, ExperienceItem, EducationItem, CertificationItem } from '../../types';
import { ResumeAutofillView } from './ResumeAutofillView';
import {
  PROFESSIONS_TAXONOMY,
  getSubFieldsForProfession,
  findProfessionByLabel,
} from '../../data/professionTaxonomy';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export const AdminModal: React.FC = () => {
  const {
    isAdminModalOpen,
    adminModalTab,
    closeAdminModal,
    profile,
    updateProfile,
    projects,
    addProject,
    updateProject,
    deleteProject,
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
    education,
    updateEducation,
    addEducation,
    deleteEducation,
    certifications,
    updateCertifications,
    addCertification,
    deleteCertification,
    layoutConfig,
    applyLayoutPreset,
    moveSection,
    toggleSectionVisibility,
    customTheme,
    updateCustomTheme,
    applyColorPreset,
    resetCustomTheme,
    startBlankPortfolio,
    resetToDefaults,
    resumeConfig,
    updateResumeConfig,
    downloadFormattedResume,
    openResumeHeist,
    exportDataJson,
    importDataJson,
    editingProjectId,
    setEditingProjectId,
    editingExperienceId,
    setEditingExperienceId,
    updateProfession,
  } = usePortfolioData();

  const { currentUser, logout, changePassword, setUserProfession } = useAuth();
  const { isDark } = useTheme();

  // Prevent background page from scrolling when admin modal is open
  useBodyScrollLock(isAdminModalOpen);

  const [activeTab, setActiveTab] = useState<AdminTab>(adminModalTab);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Sync tab from context when opened
  useEffect(() => {
    if (isAdminModalOpen) {
      setActiveTab(adminModalTab);
    }
  }, [isAdminModalOpen, adminModalTab]);

  const showNotification = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Profile Form state
  const [profileForm, setProfileForm] = useState(profile);
  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onerror = () => {
      alert('Error reading the selected image file. Please try another image.');
    };
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) return;

      const img = new Image();
      img.onerror = () => {
        // Fallback to raw data url if image decode fails in canvas
        setProfileForm((prev) => ({ ...prev, avatarUrl: rawDataUrl }));
        updateProfile({ avatarUrl: rawDataUrl });
        showNotification('Photo uploaded successfully!');
      };
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 480;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          let finalUrl = rawDataUrl;
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            finalUrl = canvas.toDataURL('image/jpeg', 0.82);
          }

          // Update both form state and parent state immediately
          setProfileForm((prev) => ({
            ...prev,
            avatarUrl: finalUrl,
          }));
          updateProfile({ avatarUrl: finalUrl });

          // Directly persist to storage
          try {
            const key = currentUser ? `abhay_portfolio_data_user_${currentUser.id}` : 'abhay_portfolio_data_public_v2';
            const currentStored = localStorage.getItem(key);
            if (currentStored) {
              const parsed = JSON.parse(currentStored);
              parsed.profile = { ...(parsed.profile || {}), avatarUrl: finalUrl };
              localStorage.setItem(key, JSON.stringify(parsed));
              localStorage.setItem('abhay_portfolio_data_public_v2', JSON.stringify(parsed));
            }
          } catch (err) {
            console.error('Failed to save to localStorage:', err);
          }

          showNotification('Photo uploaded and updated successfully!');
        } catch {
          setProfileForm((prev) => ({ ...prev, avatarUrl: rawDataUrl }));
          updateProfile({ avatarUrl: rawDataUrl });
          showNotification('Photo uploaded successfully!');
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    if (profileForm.profession && profileForm.subProfession) {
      updateProfession(profileForm.profession, profileForm.subProfession);
      if (setUserProfession) {
        await setUserProfession(profileForm.profession, profileForm.subProfession);
      }
    }
    showNotification('Profile & Profession successfully updated!');
  };

  // Project Form state (for adding or editing)
  const [projectForm, setProjectForm] = useState<{
    id?: string;
    title: string;
    subtitle: string;
    category: string;
    description: string;
    metrics: string;
    tags: string;
    githubUrl: string;
    liveUrl: string;
  }>({
    title: '',
    subtitle: '',
    category: 'Java Full Stack',
    description: '',
    metrics: '',
    tags: '',
    githubUrl: 'https://github.com/AbhayGupta002',
    liveUrl: '',
  });

  // Load project for editing if set
  useEffect(() => {
    if (editingProjectId) {
      const p = projects.find((item) => item.id === editingProjectId);
      if (p) {
        setProjectForm({
          id: p.id,
          title: p.title,
          subtitle: p.subtitle,
          category: p.category,
          description: p.description,
          metrics: p.metrics,
          tags: p.tags.join(', '),
          githubUrl: p.githubUrl,
          liveUrl: p.liveUrl || '',
        });
        setActiveTab('projects');
      }
    }
  }, [editingProjectId, projects]);

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = projectForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (projectForm.id) {
      // Update existing
      updateProject(projectForm.id, {
        title: projectForm.title,
        subtitle: projectForm.subtitle,
        category: projectForm.category,
        description: projectForm.description,
        metrics: projectForm.metrics,
        tags: tagArray,
        githubUrl: projectForm.githubUrl,
        liveUrl: projectForm.liveUrl || undefined,
      });
      showNotification('Project updated successfully!');
    } else {
      // Add new
      addProject({
        title: projectForm.title,
        subtitle: projectForm.subtitle,
        category: projectForm.category,
        description: projectForm.description,
        metrics: projectForm.metrics,
        tags: tagArray,
        githubUrl: projectForm.githubUrl,
        liveUrl: projectForm.liveUrl || undefined,
      });
      showNotification('New project added successfully!');
    }

    // Reset project form
    setProjectForm({
      title: '',
      subtitle: '',
      category: 'Java Full Stack',
      description: '',
      metrics: '',
      tags: '',
      githubUrl: 'https://github.com/AbhayGupta002',
      liveUrl: '',
    });
    setEditingProjectId(null);
  };

  // Experience Form state
  const [expForm, setExpForm] = useState<{
    id?: string;
    role: string;
    company: string;
    location: string;
    period: string;
    highlights: string;
    techStack: string;
  }>({
    role: '',
    company: '',
    location: '',
    period: '',
    highlights: '',
    techStack: '',
  });

  useEffect(() => {
    if (editingExperienceId) {
      const exp = experiences.find((item) => item.id === editingExperienceId);
      if (exp) {
        setExpForm({
          id: exp.id,
          role: exp.role,
          company: exp.company,
          location: exp.location,
          period: exp.period,
          highlights: exp.highlights.join('\n'),
          techStack: exp.techStack.join(', '),
        });
        setActiveTab('experience');
      }
    }
  }, [editingExperienceId, experiences]);

  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    const highlightArray = expForm.highlights
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);
    const techArray = expForm.techStack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (expForm.id) {
      updateExperience(expForm.id, {
        role: expForm.role,
        company: expForm.company,
        location: expForm.location,
        period: expForm.period,
        highlights: highlightArray,
        techStack: techArray,
      });
      showNotification('Experience updated successfully!');
    } else {
      addExperience({
        role: expForm.role,
        company: expForm.company,
        location: expForm.location,
        period: expForm.period,
        highlights: highlightArray,
        techStack: techArray,
      });
      showNotification('New experience added successfully!');
    }

    setExpForm({
      role: '',
      company: '',
      location: '',
      period: '',
      highlights: '',
      techStack: '',
    });
    setEditingExperienceId(null);
  };

  // Education item form
  const [eduForm, setEduForm] = useState<EducationItem>({
    degree: '',
    institution: '',
    period: '',
    location: '',
    details: '',
  });

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.degree || !eduForm.institution) return;
    addEducation(eduForm);
    setEduForm({ degree: '', institution: '', period: '', location: '', details: '' });
    showNotification('Education entry added!');
  };

  // Import JSON handler
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = importDataJson(content);
          if (success) {
            showNotification('Data imported successfully!');
          } else {
            alert('Invalid portfolio JSON format.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isAdminModalOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAdminModal();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto backdrop-blur-md bg-black/60 transition-all overscroll-contain select-none"
    >
      <div
        className={`relative w-full max-w-4xl max-h-[90dvh] sm:max-h-[88vh] flex flex-col rounded-2xl sm:rounded-3xl border shadow-2xl overflow-hidden transition-colors select-text ${
          isDark
            ? 'bg-[#0B1424] border-blue-900/50 text-slate-100 shadow-[0_20px_70px_rgba(0,0,0,0.8)]'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'border-blue-900/40 bg-[#091122]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-sm">
              🛠️
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold">Admin Portfolio Control Center</h2>
                {currentUser && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {currentUser.email}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your private workspace • Edits strictly isolated to your account ({currentUser?.email || 'admin'})
              </p>
            </div>
          </div>
          <button
            onClick={closeAdminModal}
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? 'border-blue-900/40 hover:bg-[#132238] text-slate-400 hover:text-white'
                : 'border-slate-200 hover:bg-slate-200 text-slate-600'
            }`}
            aria-label="Close Admin Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex items-center gap-1.5 px-6 pt-3 pb-2 border-b overflow-x-auto text-xs font-semibold ${
            isDark ? 'border-blue-900/30 bg-[#070D18]' : 'border-slate-200 bg-slate-100/70'
          }`}
        >
          {[
            { id: 'autofill', label: 'Resume Auto-Fill ✨', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
            { id: 'profile', label: 'Profile & Socials', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'snapshot', label: 'Snapshot Card', icon: <Terminal className="w-3.5 h-3.5" /> },
            { id: 'layout', label: 'Layout & Divs', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'colors', label: 'Color Studio', icon: <Palette className="w-3.5 h-3.5" /> },
            { id: 'resume', label: 'Resume Studio', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'projects', label: `Projects (${projects.length})`, icon: <FolderKanban className="w-3.5 h-3.5" /> },
            { id: 'experience', label: `Experience (${experiences.length})`, icon: <Briefcase className="w-3.5 h-3.5" /> },
            { id: 'education', label: 'Education & Certs', icon: <GraduationCap className="w-3.5 h-3.5" /> },
            { id: 'backup', label: 'Backup & Reset', icon: <Download className="w-3.5 h-3.5" /> },
            { id: 'account', label: 'Security & Account', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-[#101D33]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Quick Mode Switcher Banner (Visible when not on autofill tab) */}
        {activeTab !== 'autofill' && (
          <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-2 bg-blue-500/5 dark:bg-blue-950/25 border-b border-blue-500/10 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              🛠️ Building Manually. Want to autofill all fields instantly from your CV/resume?
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('autofill')}
              className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-cyan-400 hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Upload Resume & Auto-Fill</span>
            </button>
          </div>
        )}

        {/* Toast Notification */}
        {saveToast && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 text-center flex items-center justify-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4" /> {saveToast}
          </div>
        )}

        {/* Content Area (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {/* TAB 0: RESUME AUTO-FILL */}
          {activeTab === 'autofill' && (
            <ResumeAutofillView
              onSaved={() => {
                showNotification('Portfolio successfully updated from resume!');
                setActiveTab('profile');
              }}
              onSwitchToManual={() => {
                setActiveTab('profile');
              }}
            />
          )}

          {/* TAB 1: PROFILE & SOCIALS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* PRIMARY PROFESSION & SPECIALIZATION (GLOBAL TAXONOMY) */}
              <div
                className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                  isDark
                    ? 'bg-[#0E1A30]/80 border-cyan-500/30'
                    : 'bg-blue-50/60 border-blue-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-600 text-white">
                      <Briefcase className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Primary Profession & Field Taxonomy
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Select your profession domain to dynamically customize your portfolio fields
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-blue-600/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 w-fit">
                    RELATIONAL USER TABLE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                      1. Industry Domain / Profession
                    </label>
                    <select
                      value={profileForm.profession || PROFESSIONS_TAXONOMY[0].label}
                      onChange={(e) => {
                        const newProf = e.target.value;
                        const subList = getSubFieldsForProfession(newProf);
                        const firstSub = subList[0] || '';
                        const tax = findProfessionByLabel(newProf);
                        setProfileForm({
                          ...profileForm,
                          profession: newProf,
                          subProfession: firstSub,
                          title: firstSub || profileForm.title,
                          targetRole: firstSub || profileForm.targetRole,
                          snapshotFocus: `${tax.label.split('(')[0].trim()} Focus`,
                          backendTech: tax.defaultAttributes.attr1Default,
                          frontendTech: tax.defaultAttributes.attr2Default,
                          databases: tax.defaultAttributes.attr3Default,
                        });
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                        isDark ? 'bg-[#0B1528] border-blue-900/60 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      {PROFESSIONS_TAXONOMY.map((prof) => (
                        <option key={prof.id} value={prof.label}>
                          {prof.icon} {prof.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                      2. Role Specialization / Sub-Field
                    </label>
                    <select
                      value={profileForm.subProfession || getSubFieldsForProfession(profileForm.profession)[0]}
                      onChange={(e) => {
                        const newSub = e.target.value;
                        setProfileForm({
                          ...profileForm,
                          subProfession: newSub,
                          title: newSub,
                          targetRole: newSub,
                        });
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                        isDark ? 'bg-[#0B1528] border-blue-900/60 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      {getSubFieldsForProfession(profileForm.profession).map((sub, idx) => (
                        <option key={idx} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Profile Portrait & Studio Lighting Customization */}
              <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 dark:bg-cyan-950/30 space-y-3.5">
                {/* Hidden native file input for uploading custom photo */}
                <input
                  ref={photoFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />

                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Profile Portrait & Studio Customization
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    {profileForm.avatarUrl ? 'Photo Active' : 'Initials Mode Active'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 items-center">
                  {/* Photo Preview / Initials Fallback */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative h-28 w-24 overflow-hidden rounded-xl border-2 border-cyan-400/40 shadow-lg bg-[#071120]">
                      {profileForm.avatarUrl ? (
                        <img
                          src={profileForm.avatarUrl}
                          alt={profileForm.name}
                          className="h-full w-full object-cover object-top"
                          style={{
                            filter: `brightness(${profileForm.photoBrightness || 104}%) contrast(${profileForm.photoContrast || 102}%)`,
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-center p-2 text-cyan-400">
                          <span className="text-2xl font-bold font-mono">
                            {profileForm.name ? profileForm.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'AG'}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 mt-1">No Photo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Upload / Change / Remove Buttons */}
                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-slate-400 mb-1.5">
                        Photo Actions: Upload, Change, or Remove
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => photoFileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload New Photo
                        </button>

                        {profileForm.avatarUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setProfileForm((prev) => ({ ...prev, avatarUrl: '' }));
                              updateProfile({ avatarUrl: '' });
                              try {
                                const key = currentUser ? `abhay_portfolio_data_user_${currentUser.id}` : 'abhay_portfolio_data_public_v2';
                                const currentStored = localStorage.getItem(key);
                                if (currentStored) {
                                  const parsed = JSON.parse(currentStored);
                                  parsed.profile = { ...(parsed.profile || {}), avatarUrl: '' };
                                  localStorage.setItem(key, JSON.stringify(parsed));
                                  localStorage.setItem('abhay_portfolio_data_public_v2', JSON.stringify(parsed));
                                }
                              } catch (err) {
                                console.error('Failed to clear avatar from storage:', err);
                              }
                              showNotification('Photo removed. Initials will be displayed.');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-red-500/40 bg-red-950/30 hover:bg-red-900/40 text-red-300 text-xs font-semibold transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove Photo
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            const defaultUrl = '/abhay-profile-smooth.jpg';
                            setProfileForm((prev) => ({
                              ...prev,
                              avatarUrl: defaultUrl,
                            }));
                            updateProfile({ avatarUrl: defaultUrl });
                            try {
                              const key = currentUser ? `abhay_portfolio_data_user_${currentUser.id}` : 'abhay_portfolio_data_public_v2';
                              const currentStored = localStorage.getItem(key);
                              if (currentStored) {
                                const parsed = JSON.parse(currentStored);
                                parsed.profile = { ...(parsed.profile || {}), avatarUrl: defaultUrl };
                                localStorage.setItem(key, JSON.stringify(parsed));
                                localStorage.setItem('abhay_portfolio_data_public_v2', JSON.stringify(parsed));
                              }
                            } catch (err) {}
                            showNotification('Restored executive studio photo.');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                          title="Restore default suit headshot"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Restore Studio Photo
                        </button>
                      </div>
                    </div>

                    {/* Direct Image URL input */}
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Direct Photo URL or Path:
                      </label>
                      <input
                        type="text"
                        value={profileForm.avatarUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProfileForm((prev) => ({ ...prev, avatarUrl: val }));
                          updateProfile({ avatarUrl: val });
                        }}
                        placeholder="e.g. /abhay-profile-smooth.jpg or https://..."
                        className={`w-full px-3 py-1.5 rounded-xl border text-xs font-mono ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Title / Headline
                  </label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                  Hero Main Headline (Large title on Home page)
                </label>
                <input
                  type="text"
                  value={profileForm.headline || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                  placeholder="Backend Developer | Full Stack Developer | Gen AI"
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium ${
                    isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                  Professional Bio / Summary (From Resume)
                </label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                    isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Social Profiles: LinkedIn & GitHub */}
              <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-50/50 dark:bg-[#0E1A30]/50 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 flex items-center gap-1.5">
                  <LinkedinIcon className="w-4 h-4" /> Social Profiles & IDs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={profileForm.linkedinUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/your-profile"
                      className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                        isDark ? 'bg-[#0B1528] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      value={profileForm.githubUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                      placeholder="https://github.com/your-username"
                      className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                        isDark ? 'bg-[#0B1528] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                  Status Message (Hero Tag)
                </label>
                <input
                  type="text"
                  value={profileForm.statusMessage}
                  onChange={(e) => setProfileForm({ ...profileForm, statusMessage: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                    isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md transition"
                >
                  <Save className="w-4 h-4" /> Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB: SNAPSHOT CARD (Hero Right Angled Card) */}
          {activeTab === 'snapshot' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-50/50 dark:bg-[#0E1A30]/50">
                <h3 className="text-sm font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Engineering Snapshot Card (Hero Right Box)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Customize every attribute displayed on the angled engineering summary card in the Hero section.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Card Subtitle / Focus Track
                  </label>
                  <input
                    type="text"
                    value={profileForm.snapshotFocus || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, snapshotFocus: e.target.value })}
                    placeholder="Java Full Stack Focus"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Verification Badge Text
                  </label>
                  <input
                    type="text"
                    value={profileForm.snapshotBadge || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, snapshotBadge: e.target.value })}
                    placeholder="VERIFIED"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Target Role
                  </label>
                  <input
                    type="text"
                    value={profileForm.targetRole || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, targetRole: e.target.value })}
                    placeholder="Associate Software Engineer | Full Stack"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Backend Tech
                  </label>
                  <input
                    type="text"
                    value={profileForm.backendTech || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, backendTech: e.target.value })}
                    placeholder="Java 17, Spring Boot 3, REST APIs, JPA"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Frontend Tech
                  </label>
                  <input
                    type="text"
                    value={profileForm.frontendTech || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, frontendTech: e.target.value })}
                    placeholder="React, JavaScript, HTML5, CSS3, Tailwind"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Databases
                  </label>
                  <input
                    type="text"
                    value={profileForm.databases || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, databases: e.target.value })}
                    placeholder="MySQL, MongoDB, H2 Database"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Internships Row Summary
                  </label>
                  <input
                    type="text"
                    value={profileForm.internshipsSummary || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, internshipsSummary: e.target.value })}
                    placeholder="C-Net Infotech (Current) · CODTECH Solutions"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Education Row Summary
                  </label>
                  <input
                    type="text"
                    value={profileForm.educationSummary || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, educationSummary: e.target.value })}
                    placeholder="MCA (IPS Academy, Indore) · BCA (MCNUJC)"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Card Footer fields: Work Type & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border border-slate-200 dark:border-blue-900/40 bg-slate-50/70 dark:bg-[#070D18]/70">
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Card Footer Availability / Work Type
                  </label>
                  <input
                    type="text"
                    value={profileForm.workType || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, workType: e.target.value })}
                    placeholder="Full-Time Opportunities"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1">
                    Card Footer Location / Mode
                  </label>
                  <input
                    type="text"
                    value={profileForm.locationPreference || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, locationPreference: e.target.value })}
                    placeholder="Indore, MP / Remote"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Directly controls the location in this card's footer!
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md transition"
                >
                  <Save className="w-4 h-4" /> Save Snapshot Card
                </button>
              </div>
            </form>
          )}

          {/* TAB: LAYOUT & DIV ARRANGEMENT */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-50/50 dark:bg-[#0E1A30]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Layout Arrangement & Div Reordering
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Choose from 5 blueprint arrangements, arrange divs up or down, or toggle sections.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Clear all fields to start with a blank portfolio? You can fill in your own details fresh!')) {
                        startBlankPortfolio();
                        showNotification('Fields cleared! Ready for your custom details.');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 transition"
                  >
                    🧹 Start with Blank Portfolio
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Restore verified template defaults?')) {
                        resetToDefaults();
                        showNotification('Template defaults restored!');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl border border-blue-500/40 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-cyan-300 text-xs font-semibold hover:bg-blue-100 transition"
                  >
                    ↺ Restore Defaults
                  </button>
                </div>
              </div>

              {/* 5 Preset Cards */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-400 mb-3">
                  5 Pre-Configured Section Layouts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {LAYOUT_PRESETS.map((preset) => {
                    const isActive = layoutConfig.activePreset === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => {
                          applyLayoutPreset(preset.id);
                          showNotification(`Applied ${preset.name}`);
                        }}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isActive
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500/30'
                            : 'border-slate-200 dark:border-blue-900/40 hover:border-blue-400 bg-white dark:bg-[#0E1A30]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                            {preset.name}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {preset.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section Ordering & Visibility */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-400 mb-3">
                  Arrange & Reorder Divs on Website (Live Sequence)
                </h4>
                <div className="space-y-2">
                  {layoutConfig.order.map((sectionId, idx) => {
                    const isVisible = layoutConfig.visibility[sectionId] !== false;
                    const sectionTitles: Record<string, string> = {
                      hero: '01. Hero & Engineering Snapshot Card',
                      architecture: '02. Interactive Full-Stack Architectural Blueprint',
                      experience: '03. Professional Work History & Internships',
                      projects: '04. Selected Projects with GitHub & Live Demos',
                      education: '05. Academic Background & Certifications',
                    };
                    return (
                      <div
                        key={sectionId}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          isVisible
                            ? isDark
                              ? 'border-blue-900/50 bg-[#0E1A30] text-white'
                              : 'border-slate-200 bg-slate-50 text-slate-900'
                            : 'opacity-50 border-dashed border-slate-300 dark:border-slate-700 bg-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-bold">{sectionTitles[sectionId] || sectionId}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveSection(sectionId, 'up')}
                            className={`p-1.5 rounded-lg border text-xs ${
                              idx === 0
                                ? 'opacity-30 cursor-not-allowed'
                                : 'hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 dark:text-cyan-400'
                            }`}
                            title="Move section up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === layoutConfig.order.length - 1}
                            onClick={() => moveSection(sectionId, 'down')}
                            className={`p-1.5 rounded-lg border text-xs ${
                              idx === layoutConfig.order.length - 1
                                ? 'opacity-30 cursor-not-allowed'
                                : 'hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 dark:text-cyan-400'
                            }`}
                            title="Move section down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleSectionVisibility(sectionId)}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                              isVisible
                                ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                : 'text-slate-400 border-slate-300'
                            }`}
                            title={isVisible ? 'Hide this section' : 'Show this section'}
                          >
                            {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{isVisible ? 'Visible' : 'Hidden'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MULTI-COLOR THEME STUDIO */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-50/50 dark:bg-[#0E1A30]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Multi-Color Customizer & Theme Studio
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Click any color preset or customize the exact hex colors for canvas, cards, borders, text, and neon accents.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetCustomTheme();
                    showNotification('Reset theme to standard preset!');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-blue-500/40 text-blue-600 dark:text-cyan-400 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/50"
                >
                  Reset Palette
                </button>
              </div>

              {/* Color Presets */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-400 mb-3">
                  5 Designer Color Presets
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {COLOR_PRESETS.map((preset) => {
                    const isActive = customTheme.id === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => {
                          applyColorPreset(preset.id);
                          showNotification(`Applied ${preset.name}`);
                        }}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isActive
                            ? 'border-blue-500 ring-2 ring-blue-500/30'
                            : 'border-slate-200 dark:border-blue-900/40 hover:border-blue-400'
                        }`}
                        style={{ background: preset.cardBg }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold" style={{ color: preset.headingColor }}>
                            {preset.name}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                              SELECTED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className="w-5 h-5 rounded-full border shadow-sm"
                            style={{ backgroundColor: preset.canvasBg }}
                            title="Canvas Base"
                          />
                          <span
                            className="w-5 h-5 rounded-full border shadow-sm"
                            style={{ backgroundColor: preset.cardBg }}
                            title="Cards/Divs"
                          />
                          <span
                            className="w-5 h-5 rounded-full border shadow-sm"
                            style={{ backgroundColor: preset.accentColor }}
                            title="Accent"
                          />
                          <span
                            className="w-5 h-5 rounded-full border shadow-sm"
                            style={{ backgroundColor: preset.headingColor }}
                            title="Heading"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-400 mb-3">
                  Custom Color Pickers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: 'Canvas Base Background', key: 'canvasBg' },
                    { label: 'Divs & Cards Background', key: 'cardBg' },
                    { label: 'Cards Border / Depth', key: 'cardBorder' },
                    { label: 'Accent / Neon Highlight', key: 'accentColor' },
                    { label: 'Headings Typography', key: 'headingColor' },
                    { label: 'Body Text Typography', key: 'bodyTextColor' },
                  ].map(({ label, key }) => (
                    <div
                      key={key}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-blue-900/40 bg-slate-50/50 dark:bg-[#070D18]/50"
                    >
                      <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-2">
                        {label}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={(customTheme as any)[key]}
                          onChange={(e) => updateCustomTheme({ [key]: e.target.value, id: 'custom' })}
                          className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={(customTheme as any)[key]}
                          onChange={(e) => updateCustomTheme({ [key]: e.target.value, id: 'custom' })}
                          className="flex-1 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: RESUME / CV STUDIO */}
          {activeTab === 'resume' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-50/50 dark:bg-[#0E1A30]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Interactive Résumé / CV Studio
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Customize your résumé colors and typography, and export/print to device with exact colors preserved.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      closeAdminModal();
                      openResumeHeist();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs font-bold transition"
                  >
                    <span>🕵️ Test Thief Heist Animation</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadFormattedResume}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition"
                  >
                    <Printer className="w-4 h-4" /> Download / Print Formatted Résumé
                  </button>
                </div>
              </div>

              {/* Style Settings for Resume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-blue-900/40 bg-slate-50/50 dark:bg-[#070D18]/50">
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-2">
                    Résumé Header & Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={resumeConfig.accentColor}
                      onChange={(e) => updateResumeConfig({ accentColor: e.target.value })}
                      className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                    />
                    <div className="flex flex-wrap gap-2">
                      {['#2563EB', '#10B981', '#0F172A', '#8B5CF6', '#D97706', '#E11D48'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => updateResumeConfig({ accentColor: c })}
                          className="w-6 h-6 rounded-full border border-white shadow-sm hover:scale-110 transition"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-blue-900/40 bg-slate-50/50 dark:bg-[#070D18]/50">
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-2">
                    Typography Font Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'sans', label: 'Modern Sans' },
                      { id: 'serif', label: 'Classic Serif' },
                      { id: 'mono', label: 'Tech Monospace' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => updateResumeConfig({ fontFamily: f.id as any })}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                          resumeConfig.fontFamily === f.id
                            ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                            : 'bg-white dark:bg-[#0E1A30] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-900/40'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Executive Summary for Resume */}
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1.5">
                  Executive Summary (Specific to CV/Résumé)
                </label>
                <textarea
                  rows={3}
                  value={resumeConfig.customSummary || ''}
                  onChange={(e) => updateResumeConfig({ customSummary: e.target.value })}
                  placeholder="Enter custom résumé executive summary..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Add / Edit Form */}
              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#091122] border-blue-900/40' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h3 className="text-sm font-bold text-blue-600 dark:text-cyan-400 mb-4 flex items-center gap-2">
                  <FolderKanban className="w-4 h-4" />
                  {projectForm.id ? 'Edit Project' : '+ Add New Project'}
                </h3>
                <form onSubmit={handleSaveProject} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Project Title</label>
                      <input
                        type="text"
                        placeholder="e.g. HireMind AI — Advanced Job Portal"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-sm ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Category</label>
                      <input
                        type="text"
                        placeholder="e.g. Java Full Stack & AI"
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-sm ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. Spring Boot & React Platform with Role-Based Access Control"
                      value={projectForm.subtitle}
                      onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border text-sm ${
                        isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Detailed project summary..."
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border text-sm ${
                        isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                      }`}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        GitHub Repository URL (User requested)
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/AbhayGupta002/project-repo"
                        value={projectForm.githubUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-sm ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Live Web App / Demo URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://your-project.web.app"
                        value={projectForm.liveUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-sm ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Metrics / Key Badge</label>
                      <input
                        type="text"
                        placeholder="e.g. Candidate, HR & Admin Workflows · JWT / RBAC"
                        value={projectForm.metrics}
                        onChange={(e) => setProjectForm({ ...projectForm, metrics: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-sm ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Tags (Comma-separated)</label>
                      <input
                        type="text"
                        placeholder="Java 17, Spring Boot 3, React, MySQL, MongoDB"
                        value={projectForm.tags}
                        onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-sm ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end pt-2">
                    {projectForm.id && (
                      <button
                        type="button"
                        onClick={() => {
                          setProjectForm({
                            title: '',
                            subtitle: '',
                            category: 'Java Full Stack',
                            description: '',
                            metrics: '',
                            tags: '',
                            githubUrl: 'https://github.com/AbhayGupta002',
                            liveUrl: '',
                          });
                          setEditingProjectId(null);
                        }}
                        className="px-4 py-2 rounded-xl border text-xs font-semibold"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition"
                    >
                      <Save className="w-4 h-4" /> {projectForm.id ? 'Save Project Changes' : '+ Add Project'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Projects List with Edit / Delete */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-400 mb-3">
                  Current Portfolio Projects ({projects.length})
                </h4>
                <div className="space-y-3">
                  {projects.map((proj, idx) => (
                    <div
                      key={proj.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDark ? 'bg-[#0E1A30] border-blue-900/40' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400">
                            0{idx + 1}
                          </span>
                          <h5 className="font-bold text-sm">{proj.title}</h5>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                            {proj.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {proj.subtitle}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs mt-2 text-slate-500 dark:text-slate-400">
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 dark:text-cyan-400 hover:underline"
                          >
                            <GithubIcon className="w-3.5 h-3.5" /> Repo
                          </a>
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Live
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingProjectId(proj.id)}
                          className="px-3 py-1.5 rounded-xl border border-blue-500/40 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete project "${proj.title}"?`)) {
                              deleteProject(proj.id);
                              showNotification('Project deleted');
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl border border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#091122] border-blue-900/40' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h3 className="text-sm font-bold text-blue-600 dark:text-cyan-400 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {expForm.id ? 'Edit Experience' : '+ Add New Role / Internship'}
                </h3>
                <form onSubmit={handleSaveExperience} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Role / Job Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Java Full Stack Web Development Intern"
                        value={expForm.role}
                        onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-sm ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. CODTECH IT Solutions Pvt. Ltd."
                        value={expForm.company}
                        onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-sm ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Period / Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. FEB 2026 - AUG 2026"
                        value={expForm.period}
                        onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-sm ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                        }`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Remote or Bhopal, Madhya Pradesh"
                        value={expForm.location}
                        onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border text-sm ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Key Highlights & Contributions (One per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Developed Java and Spring Boot REST APIs with validation...&#10;Implemented Spring Security and JWT authentication..."
                      value={expForm.highlights}
                      onChange={(e) => setExpForm({ ...expForm, highlights: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border text-sm ${
                        isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Tech Stack (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="Java 17, Spring Boot 3, Spring Security, JWT, MySQL"
                      value={expForm.techStack}
                      onChange={(e) => setExpForm({ ...expForm, techStack: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border text-sm ${
                        isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                      }`}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3 justify-end pt-2">
                    {expForm.id && (
                      <button
                        type="button"
                        onClick={() => {
                          setExpForm({
                            role: '',
                            company: '',
                            location: '',
                            period: '',
                            highlights: '',
                            techStack: '',
                          });
                          setEditingExperienceId(null);
                        }}
                        className="px-4 py-2 rounded-xl border text-xs font-semibold"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition"
                    >
                      <Save className="w-4 h-4" /> {expForm.id ? 'Save Experience Changes' : '+ Add Role'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Experience List */}
              <div className="space-y-3">
                {experiences.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/40' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-sm">{item.role}</h5>
                      <p className="text-xs text-blue-600 dark:text-cyan-400 font-semibold">
                        {item.company} · {item.period}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {item.highlights[0]}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingExperienceId(item.id)}
                        className="px-3 py-1.5 rounded-xl border border-blue-500/40 text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete experience at "${item.company}"?`)) {
                            deleteExperience(item.id);
                            showNotification('Experience deleted');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl border border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EDUCATION & CERTIFICATIONS */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              {/* Add Education Form */}
              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-[#091122] border-blue-900/40' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h3 className="text-sm font-bold text-blue-600 dark:text-cyan-400 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> Add Academic Degree
                </h3>
                <form onSubmit={handleAddEducation} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Degree (e.g. MCA or BCA)"
                      value={eduForm.degree}
                      onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                      className={`px-3 py-2 rounded-xl border text-xs ${
                        isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                      }`}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Institution (e.g. IPS Academy, Indore)"
                      value={eduForm.institution}
                      onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                      className={`px-3 py-2 rounded-xl border text-xs ${
                        isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                      }`}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Period (e.g. JUL 2024 - JUL 2026)"
                      value={eduForm.period}
                      onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                      className={`px-3 py-2 rounded-xl border text-xs ${
                        isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                      }`}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Location (e.g. Indore, Madhya Pradesh)"
                      value={eduForm.location}
                      onChange={(e) => setEduForm({ ...eduForm, location: e.target.value })}
                      className={`px-3 py-2 rounded-xl border text-xs ${
                        isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300'
                      }`}
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
                    >
                      + Add Degree
                    </button>
                  </div>
                </form>
              </div>

              {/* List of Education */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-400">
                  Current Education Degrees ({education.length})
                </h4>
                {education.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/40' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-sm">{item.degree}</h5>
                      <p className="text-xs text-blue-600 dark:text-cyan-400 font-semibold">
                        {item.institution} · {item.period}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete ${item.degree}?`)) {
                          deleteEducation(idx);
                          showNotification('Degree removed');
                        }
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Certifications List */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-blue-900/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-400">
                  Certifications & Workshops ({certifications.length})
                </h4>
                {certifications.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/40' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-sm">{item.title}</h5>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        {item.issuer} {item.year ? `· ${item.year}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete certification "${item.title}"?`)) {
                          deleteCertification(idx);
                          showNotification('Certification removed');
                        }
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP & RESET */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div
                className={`p-6 rounded-2xl border space-y-4 ${
                  isDark ? 'bg-[#091122] border-blue-900/40' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2 text-blue-600 dark:text-cyan-400">
                    <Download className="w-4 h-4" /> Export Data Backup (JSON)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Download all your custom portfolio changes, projects, links, and content into a JSON file for safe-keeping.
                  </p>
                  <button
                    type="button"
                    onClick={exportDataJson}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Portfolio JSON Backup
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-blue-900/30">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-blue-600 dark:text-cyan-400">
                    <Upload className="w-4 h-4" /> Import Portfolio JSON
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Restore previously exported portfolio settings and projects from a file.
                  </p>
                  <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-blue-900/50 hover:bg-slate-100 dark:hover:bg-[#101D33] text-xs font-semibold cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Upload Backup File
                    <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                  </label>
                </div>

                <div className="pt-4 border-t border-red-500/30">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Reset to Official Defaults
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Reset all fields, projects, and experiences back to Abhay Gupta's official verified resume data.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all portfolio changes back to the official default resume data?')) {
                        resetToDefaults();
                        showNotification('Reset to defaults complete!');
                        closeAdminModal();
                      }
                    }}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset to Original
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SECURITY & ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-50/50 dark:bg-[#0E1A30]/50">
                <h3 className="text-sm font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Account Credentials & Security
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Manage your active login session, change your password, and verify security settings.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-blue-900/40 bg-slate-50/50 dark:bg-[#070D18]/50 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-500 dark:text-cyan-400">Authenticated Email:</span>
                  <span className="font-bold text-blue-600 dark:text-cyan-300">{currentUser?.email || 'Admin'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-500 dark:text-cyan-400">Portfolio Data Scope:</span>
                  <span className="font-mono text-emerald-500 font-semibold">Strictly Isolated ({currentUser?.id})</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-500 dark:text-cyan-400">Recovery Mobile:</span>
                  <span className="font-bold">{currentUser?.mobileNumber || '+91 62665 72529'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-500 dark:text-cyan-400">Secret Handle Protection:</span>
                  <span className="font-mono text-emerald-500 font-bold">🔒 SHA-256 (salted with email)</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  🛡️ <strong>Zero Hash Collision Guarantee:</strong> Secret handles are hashed using your email as cryptographic salt. Even if another user selects the same handle, their hash is completely different. Recovery strictly requires your Email ID first before granting access to your personal portfolio.
                </div>
              </div>

              {/* Change Password on Demand */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-blue-900/40 bg-slate-50/50 dark:bg-[#070D18]/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Update Password
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="password"
                    placeholder="New password (min 6 chars)"
                    id="accountNewPass"
                    className={`px-3.5 py-2 rounded-xl border text-sm ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const el = document.getElementById('accountNewPass') as HTMLInputElement;
                      if (el && el.value) {
                        const res = await changePassword(el.value);
                        if (res.success) {
                          showNotification('Password updated successfully!');
                          el.value = '';
                        } else {
                          alert(res.error);
                        }
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
                  >
                    Save New Password
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeAdminModal();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-500/40 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition"
                >
                  <LogOut className="w-4 h-4" /> Sign Out of Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
