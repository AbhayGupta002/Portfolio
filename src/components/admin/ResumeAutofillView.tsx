import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Edit3,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  parseResumeContent,
  extractTextFromPdfBuffer,
  ParsedResumeData,
} from '../../utils/resumeParser';

interface ResumeAutofillViewProps {
  onSaved: () => void;
  onSwitchToManual: () => void;
}

export const ResumeAutofillView: React.FC<ResumeAutofillViewProps> = ({
  onSaved,
  onSwitchToManual,
}) => {
  const { applyResumeAutofill } = usePortfolioData();
  const { isDark } = useTheme();

  // Parsing & File State
  const [isParsing, setIsParsing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Missing fields user prompt answers
  const [missingForm, setMissingForm] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Handle File Upload (PDF, TXT, MD, JSON, DOCX)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setUploadedFileName(file.name);
    setIsParsing(true);

    try {
      let rawText = '';

      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const buffer = await file.arrayBuffer();
        rawText = extractTextFromPdfBuffer(buffer);
        if (!rawText || rawText.trim().length < 50) {
          // Fallback reading as text if pure stream extraction was short
          const textReader = new FileReader();
          textReader.onload = () => {
            const content = (textReader.result as string) || '';
            processTextContent(content);
          };
          textReader.readAsText(file);
          return;
        }
      } else {
        // Plain text, Markdown, JSON
        rawText = await file.text();
      }

      processTextContent(rawText);
    } catch (err: any) {
      console.error('Failed to parse file', err);
      setErrorMessage(
        'Could not parse text from this file. Please paste your resume text in the box below instead.'
      );
      setIsParsing(false);
    }
  };

  // 2. Process Text Content
  const processTextContent = (rawText: string) => {
    try {
      // Check if it's a JSON portfolio backup
      if (rawText.trim().startsWith('{') && rawText.includes('"profile"')) {
        const json = JSON.parse(rawText);
        if (json.profile) {
          const directData: ParsedResumeData = {
            name: json.profile.name || '',
            title: json.profile.title || '',
            email: json.profile.email || '',
            phone: json.profile.phone || '',
            location: json.profile.location || '',
            githubUrl: json.profile.githubUrl || '',
            linkedinUrl: json.profile.linkedinUrl || '',
            portfolioUrl: json.profile.portfolioUrl || '',
            bio: json.profile.bio || '',
            summary: json.profile.summary || '',
            primarySkills: json.profile.primarySkills || [],
            backendTech: json.profile.backendTech || '',
            frontendTech: json.profile.frontendTech || '',
            databases: json.profile.databases || '',
            targetRole: json.profile.targetRole || json.profile.title || '',
            workType: json.profile.workType || 'Full-time / Hybrid',
            experiences: json.experiences || [],
            projects: json.projects || [],
            education: json.profile.education || [],
            certifications: json.profile.certifications || [],
            missingFields: [],
            rawText: 'Imported from JSON portfolio',
          };
          setParsedData(directData);
          setIsParsing(false);
          return;
        }
      }

      const result = parseResumeContent(rawText);
      setParsedData(result);

      // Initialize missingForm with any values detected
      const initialMissing: Record<string, string> = {};
      result.missingFields.forEach((mf) => {
        initialMissing[mf.key] = '';
      });
      setMissingForm(initialMissing);
    } catch (err: any) {
      setErrorMessage('Error extracting resume data: ' + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  // 3. Handle Paste Parse
  const handlePasteSubmit = () => {
    if (!pastedText.trim()) {
      setErrorMessage('Please paste some resume text first.');
      return;
    }
    setErrorMessage(null);
    setIsParsing(true);
    setUploadedFileName('Pasted Resume Text');
    setTimeout(() => {
      processTextContent(pastedText);
    }, 200);
  };

  // 4. Update Field in Parsed Data
  const updateParsedField = <K extends keyof ParsedResumeData>(key: K, value: ParsedResumeData[K]) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      [key]: value,
    });
  };

  // 5. Save & Commit to Portfolio
  const handleSaveToPortfolio = () => {
    if (!parsedData) return;

    // Apply any filled missing fields
    const finalData: ParsedResumeData = {
      ...parsedData,
      githubUrl: missingForm.githubUrl || parsedData.githubUrl,
      linkedinUrl: missingForm.linkedinUrl || parsedData.linkedinUrl,
      email: missingForm.email || parsedData.email,
      phone: missingForm.phone || parsedData.phone,
    };

    // Validate essential name
    if (!finalData.name || finalData.name.trim().length === 0) {
      setErrorMessage('Please enter your full name before saving.');
      return;
    }

    applyResumeAutofill(finalData);
    setSuccessToast('🎉 Resume data successfully applied! All portfolio fields are now autofilled.');
    setTimeout(() => {
      setSuccessToast(null);
      onSaved();
    }, 1500);
  };

  // 6. Reset
  const handleReset = () => {
    setParsedData(null);
    setUploadedFileName(null);
    setPastedText('');
    setErrorMessage(null);
    setMissingForm({});
  };

  return (
    <div className="space-y-6">
      {/* Top Selection Banner: Choose Manual or Upload Resume */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-950/20">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2 text-blue-600 dark:text-cyan-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Resume Auto-Fill Studio
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Upload your resume (PDF/DOCX/TXT) or paste content to instantly autofill your portfolio fields.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={onSwitchToManual}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              isDark
                ? 'border-blue-900/60 bg-[#0E1A30] text-slate-300 hover:text-white hover:border-cyan-500/50'
                : 'border-slate-300 bg-white text-slate-700 hover:text-blue-600 hover:border-blue-400'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Switch to Manual Builder</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* STEP 1: UPLOAD / PASTE SECTION (Visible when not parsed yet) */}
      {!parsedData && (
        <div className="space-y-6">
          {/* File Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer group flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed transition-all ${
              isDark
                ? 'border-blue-900/60 hover:border-cyan-400/80 bg-[#0A1324]/60 hover:bg-[#0D1A30]'
                : 'border-slate-300 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.md,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-500 group-hover:scale-110 flex items-center justify-center transition-transform mb-3 shadow-inner">
              <Upload className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-white text-center">
              Click to browse or drop your resume here
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
              Supports <span className="font-semibold text-blue-500">PDF, DOCX, TXT, Markdown, or JSON</span>
            </p>

            <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-400">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">Client-Side Parser</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Private & Secure</span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-blue-900/40" />
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              OR PASTE RESUME TEXT
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-blue-900/40" />
          </div>

          {/* Plain Text Paste Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400">
                Paste Resume / LinkedIn Profile Text
              </label>
              <span className="text-[11px] text-slate-400">Copy & paste plain text directly</span>
            </div>
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your resume sections, work experience, education, skills, and links here..."
              className={`w-full p-3.5 rounded-2xl border text-xs font-mono transition resize-none ${
                isDark
                  ? 'bg-[#0E1A30] border-blue-900/50 text-slate-200 placeholder-slate-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handlePasteSubmit}
                disabled={isParsing || !pastedText.trim()}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md transition ${
                  !pastedText.trim()
                    ? 'bg-slate-400 opacity-60 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 active:scale-[0.99]'
                }`}
              >
                {isParsing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Parsing Resume...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Fill Portfolio from Text</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PARSED PREVIEW & MISSING DETAILS INQUIRY (Visible when parsedData is available) */}
      {parsedData && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Summary Pill */}
          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Resume Extracted: {parsedData.name || 'Candidate Profile'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                  Extracted from <code className="font-mono text-emerald-600 dark:text-emerald-400">{uploadedFileName}</code> • Review and adjust any field below before saving.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-blue-900/50 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              >
                Upload Different File
              </button>
            </div>
          </div>

          {/* MISSING DETAILS INQUIRY ALERT (As requested by user: Ask for more details if needed) */}
          {parsedData.missingFields.length > 0 && (
            <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Additional Details Needed ({parsedData.missingFields.length} fields missing)
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                The parser did not find the following fields in your resume. You can provide them right now or skip:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {parsedData.missingFields.map((mf) => (
                  <div key={mf.key} className="space-y-1">
                    <label className="text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                      <span>{mf.label}</span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400">Missing</span>
                    </label>
                    <input
                      type="text"
                      placeholder={`Enter your ${mf.label.toLowerCase()}...`}
                      value={missingForm[mf.key] || ''}
                      onChange={(e) =>
                        setMissingForm({ ...missingForm, [mf.key]: e.target.value })
                      }
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${
                        isDark
                          ? 'bg-[#0E1A30] border-amber-500/40 text-white placeholder-slate-500'
                          : 'bg-white border-amber-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDITABLE REVIEW SECTIONS */}
          <div className="space-y-5">
            {/* Section 1: Basic Profile */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-blue-900/40 bg-slate-50/50 dark:bg-[#070D18]/50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                1. Basic Profile & Socials
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-cyan-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={parsedData.name}
                    onChange={(e) => updateParsedField('name', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-cyan-400 mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={parsedData.title}
                    onChange={(e) => updateParsedField('title', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-cyan-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={parsedData.location}
                    onChange={(e) => updateParsedField('location', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-cyan-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={parsedData.email}
                    onChange={(e) => updateParsedField('email', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-cyan-400 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={parsedData.phone}
                    onChange={(e) => updateParsedField('phone', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-cyan-400 mb-1">
                    GitHub Profile Link
                  </label>
                  <input
                    type="text"
                    value={parsedData.githubUrl}
                    onChange={(e) => updateParsedField('githubUrl', e.target.value)}
                    placeholder="https://github.com/..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-cyan-400 mb-1">
                    LinkedIn Profile Link
                  </label>
                  <input
                    type="text"
                    value={parsedData.linkedinUrl}
                    onChange={(e) => updateParsedField('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Bio & Summary */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-blue-900/40 bg-slate-50/50 dark:bg-[#070D18]/50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                2. Professional Bio & Executive Summary
              </h4>
              <textarea
                rows={3}
                value={parsedData.bio}
                onChange={(e) => {
                  updateParsedField('bio', e.target.value);
                  updateParsedField('summary', e.target.value);
                }}
                className={`w-full p-3 rounded-xl border text-xs ${
                  isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            {/* Section 3: Technical Skills */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-blue-900/40 bg-slate-50/50 dark:bg-[#070D18]/50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-blue-500" />
                3. Skills Breakdown ({parsedData.primarySkills.length} skills identified)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {parsedData.primarySkills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-600/15 text-blue-600 dark:text-cyan-400 border border-blue-500/30"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        const next = parsedData.primarySkills.filter((_, idx) => idx !== sIdx);
                        updateParsedField('primarySkills', next);
                      }}
                      className="hover:text-red-400 text-slate-400 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-cyan-400 mb-1">
                    Backend Tech Stack
                  </label>
                  <input
                    type="text"
                    value={parsedData.backendTech}
                    onChange={(e) => updateParsedField('backendTech', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-cyan-400 mb-1">
                    Frontend Tech Stack
                  </label>
                  <input
                    type="text"
                    value={parsedData.frontendTech}
                    onChange={(e) => updateParsedField('frontendTech', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-cyan-400 mb-1">
                    Databases
                  </label>
                  <input
                    type="text"
                    value={parsedData.databases}
                    onChange={(e) => updateParsedField('databases', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      isDark ? 'bg-[#0E1A30] border-blue-900/50 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Work Experience */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-blue-900/40 bg-slate-50/50 dark:bg-[#070D18]/50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                4. Work Experiences ({parsedData.experiences.length} extracted)
              </h4>
              <div className="space-y-3">
                {parsedData.experiences.map((exp, eIdx) => (
                  <div
                    key={exp.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-blue-900/30 bg-white dark:bg-[#0B1528] space-y-2 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={exp.role}
                        placeholder="Role"
                        onChange={(e) => {
                          const updated = [...parsedData.experiences];
                          updated[eIdx].role = e.target.value;
                          updateParsedField('experiences', updated);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border font-bold ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/40 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                      <input
                        type="text"
                        value={exp.company}
                        placeholder="Company"
                        onChange={(e) => {
                          const updated = [...parsedData.experiences];
                          updated[eIdx].company = e.target.value;
                          updateParsedField('experiences', updated);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/40 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                      <input
                        type="text"
                        value={exp.period}
                        placeholder="Period"
                        onChange={(e) => {
                          const updated = [...parsedData.experiences];
                          updated[eIdx].period = e.target.value;
                          updateParsedField('experiences', updated);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border font-mono ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/40 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Projects */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-blue-900/40 bg-slate-50/50 dark:bg-[#070D18]/50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <FolderKanban className="w-3.5 h-3.5 text-blue-500" />
                5. Projects ({parsedData.projects.length} extracted)
              </h4>
              <div className="space-y-3">
                {parsedData.projects.map((proj, pIdx) => (
                  <div
                    key={proj.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-blue-900/30 bg-white dark:bg-[#0B1528] space-y-2 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={proj.title}
                        placeholder="Project Title"
                        onChange={(e) => {
                          const updated = [...parsedData.projects];
                          updated[pIdx].title = e.target.value;
                          updateParsedField('projects', updated);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border font-bold ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/40 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                      <input
                        type="text"
                        value={proj.metrics}
                        placeholder="Metrics / Badge"
                        onChange={(e) => {
                          const updated = [...parsedData.projects];
                          updated[pIdx].metrics = e.target.value;
                          updateParsedField('projects', updated);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border font-mono text-[11px] ${
                          isDark ? 'bg-[#0E1A30] border-blue-900/40 text-white' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={proj.description}
                      placeholder="Project Description"
                      onChange={(e) => {
                        const updated = [...parsedData.projects];
                        updated[pIdx].description = e.target.value;
                        updateParsedField('projects', updated);
                      }}
                      className={`w-full p-2 rounded-lg border text-xs ${
                        isDark ? 'bg-[#0E1A30] border-blue-900/40 text-white' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTION BUTTON BAR: SAVE & CONFIRM */}
          <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Clicking save will update your portfolio workspace immediately.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 dark:border-blue-900/50 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#132238] transition"
              >
                Discard & Reset
              </button>

              <button
                type="button"
                onClick={handleSaveToPortfolio}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg active:scale-95 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save & Apply to Portfolio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
