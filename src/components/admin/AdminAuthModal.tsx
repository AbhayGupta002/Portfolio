import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Phone,
  Sparkles,
  Briefcase,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useAuth, ADMIN_EMAIL } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import {
  PROFESSIONS_TAXONOMY,
  getSubFieldsForProfession,
  findProfessionByLabel,
} from '../../data/professionTaxonomy';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export const AdminAuthModal: React.FC = () => {
  const {
    currentUser,
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    setAuthModalMode,
    login,
    changePassword,
    changePasswordWithCurrent,
    setUserProfession,
    verifyRecovery,
    failedAttempts,
    isLocked,
    lockoutRemainingText,
  } = useAuth();

  const { isDark } = useTheme();
  const { updateProfession, setIsAdminMode, openAdminModal } = usePortfolioData();

  // Prevent background page from scrolling when auth modal is open
  useBodyScrollLock(isAuthModalOpen);

  // Form states
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryInput, setRecoveryInput] = useState('');

  // Profession setup states
  const [selectedProfession, setSelectedProfession] = useState<string>(
    currentUser?.profession || PROFESSIONS_TAXONOMY[0].label
  );
  const [selectedSubField, setSelectedSubField] = useState<string>(
    currentUser?.subProfession || PROFESSIONS_TAXONOMY[0].subFields[0]
  );
  const [customRoleInput, setCustomRoleInput] = useState<string>('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleProfessionChange = (newProf: string) => {
    setSelectedProfession(newProf);
    const subList = getSubFieldsForProfession(newProf);
    if (subList && subList.length > 0) {
      setSelectedSubField(subList[0]);
    }
    setCustomRoleInput('');
  };

  // 1. Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await login(email || ADMIN_EMAIL, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed');
      } else if (res.needsPasswordChange) {
        setSuccessMessage('Password verified! Please set your new password.');
      } else if (res.needsProfessionSetup) {
        setSuccessMessage('Login verified! Please link your profession to customize your portfolio.');
      } else {
        setSuccessMessage('Login successful! Opening Admin Control Center...');
        setIsAdminMode(true);
        setTimeout(() => {
          closeAuthModal();
          openAdminModal('profile');
        }, 300);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Change Password (supports changing while login or when logged in)
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match. Please re-type carefully.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (currentUser) {
        // Logged-in session change
        const res = await changePassword(newPassword);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to update password');
        } else if (res.needsProfessionSetup) {
          setSuccessMessage('Password updated & hashed! Please confirm your primary profession.');
        } else {
          setSuccessMessage('Password changed successfully and securely hashed in the database! Opening Admin Panel...');
          setIsAdminMode(true);
          setTimeout(() => {
            closeAuthModal();
            openAdminModal('profile');
          }, 300);
        }
      } else {
        // Change password while login: verify email + current password
        const res = await changePasswordWithCurrent(
          email || ADMIN_EMAIL,
          currentPasswordInput,
          newPassword
        );
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to update password');
        } else {
          setSuccessMessage('Password successfully updated and securely hashed in the database! Opening Admin Panel...');
          setCurrentPasswordInput('');
          setNewPassword('');
          setConfirmPassword('');
          setIsAdminMode(true);
          setTimeout(() => {
            closeAuthModal();
            openAdminModal('profile');
          }, 300);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while changing password');
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Profession Setup
  const handleProfessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const isCustom =
      selectedSubField.toLowerCase().includes('custom') ||
      selectedSubField.toLowerCase().includes('other');
    const finalRole = isCustom ? customRoleInput.trim() : selectedSubField.trim();

    if (!finalRole) {
      setErrorMessage('Please specify or select your role specialization.');
      return;
    }

    setLoading(true);
    try {
      const res = await setUserProfession(selectedProfession, finalRole);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to link profession.');
      } else {
        updateProfession(selectedProfession, finalRole);
        setIsAdminMode(true);
        setSuccessMessage('Profession successfully linked to your portfolio!');
        setTimeout(() => {
          openAdminModal('profile');
        }, 300);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save profession selection');
    } finally {
      setLoading(false);
    }
  };

  // 4. Submit Forgot Password / Recovery Verification
  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await verifyRecovery(email || ADMIN_EMAIL, recoveryInput);
      if (!res.success) {
        setErrorMessage(res.error || 'Verification failed');
      } else {
        setSuccessMessage('Security verification passed! You may now set your new password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Recovery failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto backdrop-blur-md bg-black/70 animate-fadeIn overscroll-contain select-none"
    >
      <div
        className={`relative w-full max-w-md max-h-[90dvh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl border shadow-2xl overflow-y-auto overscroll-contain transition-colors select-text ${
          isDark
            ? 'bg-[#0B1424] border-blue-900/60 text-slate-100 shadow-[0_25px_70px_rgba(0,0,0,0.85)]'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Header Bar */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'border-blue-900/40 bg-[#091122]' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-sm">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                {authModalMode === 'login' && 'Admin Authentication'}
                {authModalMode === 'change_password' && 'Change Admin Password'}
                {authModalMode === 'forgot_password' && 'Account Recovery'}
                {authModalMode === 'profession_setup' && 'Select Profession & Field'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {authModalMode === 'login' && 'Sign in to access portfolio edit center'}
                {authModalMode === 'change_password' && 'Set & hash your new password in the database'}
                {authModalMode === 'forgot_password' && 'Verify mobile or secret unique username'}
                {authModalMode === 'profession_setup' && 'Configure role taxonomy for your portfolio'}
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className={`p-1.5 rounded-xl border transition-colors ${
              isDark
                ? 'border-blue-900/40 hover:bg-[#132238] text-slate-400 hover:text-white'
                : 'border-slate-200 hover:bg-slate-200 text-slate-600'
            }`}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs (Sign In vs Change Password) */}
        {(authModalMode === 'login' || authModalMode === 'change_password') && (
          <div className="px-6 pt-4 pb-1">
            <div
              className={`grid grid-cols-2 p-1 rounded-xl text-xs font-semibold ${
                isDark ? 'bg-[#0E1A30]' : 'bg-slate-100'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setAuthModalMode('login');
                }}
                className={`py-2 rounded-lg transition text-center ${
                  authModalMode === 'login'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setAuthModalMode('change_password');
                }}
                className={`py-2 rounded-lg transition text-center ${
                  authModalMode === 'change_password'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Change Password
              </button>
            </div>
          </div>
        )}

        {/* Lockout Warning Banner */}
        {isLocked && (
          <div className="px-5 py-3 bg-red-500/10 border-b border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <div>
              <p className="font-bold">Security Lockout Active (3 Failed Attempts)</p>
              <p className="text-[11px]">
                Locked for: <span className="font-mono font-bold">{lockoutRemainingText}</span>. Use Forgot Password to unlock immediately.
              </p>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {errorMessage && (
          <div className="m-4 mb-0 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="m-4 mb-0 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ================= MODE 1: LOGIN ================= */}
        {authModalMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1.5">
                Admin Email ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gupta.abhayit@gmail.com"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm font-medium transition ${
                    isDark
                      ? 'bg-[#0E1A30] border-blue-900/50 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setAuthModalMode('forgot_password');
                  }}
                  className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm font-medium transition ${
                    isDark
                      ? 'bg-[#0E1A30] border-blue-900/50 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Admin account: <code className="font-mono font-bold text-blue-500">gupta.abhayit@gmail.com</code> (stored hashed in database)
              </p>
            </div>

            {/* Attempt meter */}
            {failedAttempts > 0 && !isLocked && (
              <div className="text-[11px] font-mono text-amber-500">
                Failed attempts: {failedAttempts} / 3 (Account locks for 1 hour on 3rd attempt)
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isLocked}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md transition ${
                isLocked
                  ? 'bg-slate-500 opacity-60 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 active:scale-[0.99]'
              }`}
            >
              {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 border-t border-slate-100 dark:border-blue-900/30 flex items-center justify-between text-xs text-slate-500">
              <span>Need to change password?</span>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setAuthModalMode('change_password');
                }}
                className="font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
              >
                Change password while login →
              </button>
            </div>
          </form>
        )}

        {/* ================= MODE 2: CHANGE PASSWORD ================= */}
        {authModalMode === 'change_password' && (
          <form onSubmit={handleChangePasswordSubmit} className="p-6 space-y-4">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-700 dark:text-cyan-300">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Secure Password Update
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                Passwords are automatically salted and hashed using SHA-256 before storing into the login table.
              </p>
            </div>

            {!currentUser && (
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1.5">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gupta.abhayit@gmail.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition ${
                    isDark
                      ? 'bg-[#0E1A30] border-blue-900/50 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                  required
                />
              </div>
            )}

            {!currentUser && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400">
                    Current Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setSuccessMessage(null);
                      setAuthModalMode('forgot_password');
                    }}
                    className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                  >
                    Forgot current password?
                  </button>
                </div>
                <input
                  type="password"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="Enter current password (e.g. Abhay@2529)"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition ${
                    isDark
                      ? 'bg-[#0E1A30] border-blue-900/50 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1.5">
                New Password (minimum 6 characters)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition ${
                  isDark
                    ? 'bg-[#0E1A30] border-blue-900/50 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition ${
                  isDark
                    ? 'bg-[#0E1A30] border-blue-900/50 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] shadow-md transition"
            >
              {loading ? 'Saving...' : 'Update Password & Save in Database'}
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setAuthModalMode('login');
                }}
                className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* ================= MODE 3: FORGOT PASSWORD / ACCOUNT RECOVERY ================= */}
        {authModalMode === 'forgot_password' && (
          <form onSubmit={handleRecoverySubmit} className="p-6 space-y-4">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Account Security Recovery
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                To reset your password, enter your registered email and your registered Mobile Number or secret handle.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1.5">
                Admin Registered Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gupta.abhayit@gmail.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition ${
                  isDark
                    ? 'bg-[#0E1A30] border-blue-900/50 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1.5">
                Registered Mobile (+91 62665 72529) OR Secret Handle
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={recoveryInput}
                  onChange={(e) => setRecoveryInput(e.target.value)}
                  placeholder="Enter 6266572529 or @abhay_gupta"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm font-medium transition ${
                    isDark
                      ? 'bg-[#0E1A30] border-blue-900/50 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                  required
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] shadow-md transition"
            >
              {loading ? 'Verifying...' : 'Verify Identity & Unlock'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setAuthModalMode('login');
                }}
                className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        {/* ================= MODE 4: PROFESSION & FIELD SETUP ================= */}
        {authModalMode === 'profession_setup' && (
          <form onSubmit={handleProfessionSubmit} className="p-6 space-y-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                Select Your Profession & Specialized Field
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                Choose your primary domain from the taxonomy. Relevant roles and sub-fields will automatically adapt your portfolio.
              </p>
            </div>

            {/* Profession Domain Dropdown */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                Primary Profession / Industry Domain:
              </label>
              <div className="relative">
                <select
                  value={selectedProfession}
                  onChange={(e) => handleProfessionChange(e.target.value)}
                  className={`w-full appearance-none px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition ${
                    isDark
                      ? 'bg-[#0E1A30] border-blue-900/60 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {PROFESSIONS_TAXONOMY.map((item) => (
                    <option key={item.id} value={item.label} className={isDark ? 'bg-[#0B1424] text-white' : 'bg-white text-slate-900'}>
                      {item.icon} {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Sub-Field Specialization Dropdown */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-500" />
                Specialized Role / Sub-Field (auto-filtered for {selectedProfession}):
              </label>
              <div className="relative">
                <select
                  value={selectedSubField}
                  onChange={(e) => setSelectedSubField(e.target.value)}
                  className={`w-full appearance-none px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition ${
                    isDark
                      ? 'bg-[#0E1A30] border-blue-900/60 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {getSubFieldsForProfession(selectedProfession).map((sub, idx) => (
                    <option key={idx} value={sub} className={isDark ? 'bg-[#0B1424] text-white' : 'bg-white text-slate-900'}>
                      {sub}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Custom Role Input */}
            {(selectedSubField.toLowerCase().includes('custom') ||
              selectedSubField.toLowerCase().includes('other')) && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-mono font-semibold text-slate-500 dark:text-cyan-400 mb-1.5">
                  Type Custom Role Title:
                </label>
                <input
                  type="text"
                  value={customRoleInput}
                  onChange={(e) => setCustomRoleInput(e.target.value)}
                  placeholder="e.g. AI Prompt Engineer, Site Reliability Engineer"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition ${
                    isDark
                      ? 'bg-[#0E1A30] border-blue-900/50 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] shadow-md transition"
            >
              {loading ? 'Saving...' : 'Save & Launch Admin Control Center'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
