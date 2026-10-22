import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '../types';
import {
  sha256Hash,
  generateSalt,
  normalizeSecretUsername,
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION_MS,
  formatLockoutRemaining,
} from '../utils/security';

export const ADMIN_EMAIL = 'gupta.abhayit@gmail.com';
export const DEFAULT_ADMIN_PASS = 'Abhay@2529';

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'change_password' | 'forgot_password' | 'profession_setup';
  failedAttempts: number;
  lockUntil: number | null;
  lockoutRemainingText: string;
  isLocked: boolean;

  openAuthModal: (mode?: 'login' | 'change_password' | 'forgot_password' | 'profession_setup') => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'login' | 'change_password' | 'forgot_password' | 'profession_setup') => void;

  login: (email: string, password: string) => Promise<{ success: boolean; needsPasswordChange?: boolean; needsProfessionSetup?: boolean; error?: string }>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; needsProfessionSetup?: boolean; error?: string }>;
  changePasswordWithCurrent: (
    email: string,
    currentPass: string,
    newPass: string
  ) => Promise<{ success: boolean; error?: string }>;
  setUserProfession: (profession: string, subProfession: string) => Promise<{ success: boolean; error?: string }>;
  verifyRecovery: (email: string, recoveryInput: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const USERS_STORAGE_KEY = 'abhay_portfolio_admin_login_table_v4';
const CURRENT_USER_SESSION_KEY = 'abhay_portfolio_current_user_session_v4';
const ATTEMPTS_STORAGE_KEY = 'abhay_portfolio_auth_lockout_v4';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<
    'login' | 'change_password' | 'forgot_password' | 'profession_setup'
  >('login');

  // Recovery pending state when user is changing password via forgot password
  const [pendingRecoveryUserId, setPendingRecoveryUserId] = useState<string | null>(null);

  // Lockout state
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [lockoutRemainingText, setLockoutRemainingText] = useState<string>('');

  // 1. Initialize Users/Login Table in Database (Store only Admin Account with Hashed Password)
  useEffect(() => {
    async function initUsers() {
      try {
        const saved = localStorage.getItem(USERS_STORAGE_KEY);
        if (saved) {
          const parsed: UserAccount[] = JSON.parse(saved);
          if (parsed && parsed.length > 0) {
            // Find existing admin record
            const adminRecord = parsed.find(
              (u) => u.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
            );
            if (adminRecord) {
              setUsers([adminRecord]);
              return;
            }
          }
        }

        // Initialize admin user with hashed password (Abhay@2529) and salt
        const salt = generateSalt();
        const passwordHash = await sha256Hash(DEFAULT_ADMIN_PASS, salt);
        const secretNormalized = normalizeSecretUsername('abhay_gupta');
        const defaultSecretHash = await sha256Hash(secretNormalized, ADMIN_EMAIL.toLowerCase());

        const initialAdmin: UserAccount = {
          id: 'admin_abhay_gupta',
          email: ADMIN_EMAIL,
          passwordHash,
          salt,
          needsPasswordChange: false,
          mobileNumber: '+91 62665 72529',
          secretUsernameHash: defaultSecretHash,
          portfolioId: 'portfolio_default_abhay',
          profession: 'Information Technology (IT)',
          subProfession: 'Full Stack Developer',
          isProfessionSetupComplete: true,
          createdAt: new Date().toISOString(),
        };

        const initialList = [initialAdmin];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialList));
        setUsers(initialList);
      } catch (e) {
        console.error('Failed to init login table in database', e);
      }
    }

    initUsers();
  }, []);

  // 2. Load active session
  useEffect(() => {
    try {
      const session = sessionStorage.getItem(CURRENT_USER_SESSION_KEY);
      if (session) {
        const user: UserAccount = JSON.parse(session);
        setCurrentUser(user);
      }
    } catch {
      // ignore
    }
  }, []);

  // 3. Load Lockout state & run countdown ticker
  useEffect(() => {
    try {
      const lockData = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      if (lockData) {
        const parsed = JSON.parse(lockData);
        if (parsed.lockUntil && Date.now() < parsed.lockUntil) {
          setLockUntil(parsed.lockUntil);
          setFailedAttempts(parsed.attempts || MAX_LOGIN_ATTEMPTS);
        } else if (parsed.attempts) {
          setFailedAttempts(parsed.attempts);
        }
      }
    } catch {
      // ignore
    }

    const interval = setInterval(() => {
      const lockData = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      if (lockData) {
        try {
          const parsed = JSON.parse(lockData);
          if (parsed.lockUntil) {
            const diff = parsed.lockUntil - Date.now();
            if (diff > 0) {
              setLockUntil(parsed.lockUntil);
              setLockoutRemainingText(formatLockoutRemaining(diff));
            } else {
              // Lockout expired!
              setLockUntil(null);
              setFailedAttempts(0);
              setLockoutRemainingText('');
              localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
            }
          }
        } catch {
          // ignore
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const saveUsers = (updated: UserAccount[]) => {
    setUsers(updated);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
  };

  const isLocked = Boolean(lockUntil && Date.now() < lockUntil);

  // Modal handlers
  const openAuthModal = (
    mode: 'login' | 'change_password' | 'forgot_password' | 'profession_setup' = 'login'
  ) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Login handler
  const login = async (
    email: string,
    pass: string
  ): Promise<{
    success: boolean;
    needsPasswordChange?: boolean;
    needsProfessionSetup?: boolean;
    error?: string;
  }> => {
    // Check lockout first
    if (lockUntil && Date.now() < lockUntil) {
      const remaining = formatLockoutRemaining(lockUntil - Date.now());
      return {
        success: false,
        error: `Account is temporarily locked for ${remaining} due to 3 failed attempts. You may also use Forgot Password.`,
      };
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.trim().toLowerCase() === trimmedEmail);

    if (!user) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_DURATION_MS;
        setLockUntil(until);
        localStorage.setItem(
          ATTEMPTS_STORAGE_KEY,
          JSON.stringify({ attempts: newAttempts, lockUntil: until })
        );
        return {
          success: false,
          error: `Maximum attempts reached (${MAX_LOGIN_ATTEMPTS}). Account locked for 1 hour. Please use Forgot Password.`,
        };
      } else {
        localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify({ attempts: newAttempts }));
        return {
          success: false,
          error: `Invalid email or password. Attempt ${newAttempts} of ${MAX_LOGIN_ATTEMPTS}.`,
        };
      }
    }

    // Verify Password Hash using SHA-256 + cryptographic salt
    const computedHash = await sha256Hash(pass, user.salt);
    if (computedHash !== user.passwordHash) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_DURATION_MS;
        setLockUntil(until);
        localStorage.setItem(
          ATTEMPTS_STORAGE_KEY,
          JSON.stringify({ attempts: newAttempts, lockUntil: until })
        );
        return {
          success: false,
          error: `Maximum attempts reached (${MAX_LOGIN_ATTEMPTS}). Account locked for 1 hour. Please use Forgot Password.`,
        };
      } else {
        localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify({ attempts: newAttempts }));
        return {
          success: false,
          error: `Invalid email or password. Attempt ${newAttempts} of ${MAX_LOGIN_ATTEMPTS}.`,
        };
      }
    }

    // Successful password match! Clear lockouts
    setFailedAttempts(0);
    setLockUntil(null);
    localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
    setCurrentUser(user);
    sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(user));

    if (user.needsPasswordChange) {
      setAuthModalMode('change_password');
      return { success: true, needsPasswordChange: true };
    }

    if (!user.profession || !user.isProfessionSetupComplete) {
      setAuthModalMode('profession_setup');
      return { success: true, needsProfessionSetup: true };
    }

    setIsAuthModalOpen(false);
    return { success: true, needsPasswordChange: false };
  };

  // Change Password directly from Login modal (verifying current password)
  const changePasswordWithCurrent = async (
    email: string,
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.trim().toLowerCase() === trimmedEmail);

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (!currentPass) {
      return { success: false, error: 'Please enter your current password to authorize change.' };
    }

    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    // Verify current password against stored hash
    const computedCurrentHash = await sha256Hash(currentPass, user.salt);
    if (computedCurrentHash !== user.passwordHash) {
      return { success: false, error: 'Current password is incorrect. Verification failed.' };
    }

    // Generate fresh salt and compute SHA-256 hash
    const newSalt = generateSalt();
    const newPasswordHash = await sha256Hash(newPass, newSalt);

    const updatedUser: UserAccount = {
      ...user,
      passwordHash: newPasswordHash,
      salt: newSalt,
      needsPasswordChange: false,
    };

    const updatedList = [updatedUser];
    saveUsers(updatedList);
    setCurrentUser(updatedUser);
    sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(updatedUser));

    // Clear any lockout
    setFailedAttempts(0);
    setLockUntil(null);
    localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
    setIsAuthModalOpen(false);

    return { success: true };
  };

  // Change Password handler (when logged in or via recovery)
  const changePassword = async (
    newPassword: string
  ): Promise<{ success: boolean; needsProfessionSetup?: boolean; error?: string }> => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const targetUser = currentUser || users.find((u) => u.id === pendingRecoveryUserId) || users[0];
    if (!targetUser) {
      return { success: false, error: 'No user account found to update password.' };
    }

    const newSalt = generateSalt();
    const newHash = await sha256Hash(newPassword, newSalt);

    const updatedUser: UserAccount = {
      ...targetUser,
      passwordHash: newHash,
      salt: newSalt,
      needsPasswordChange: false,
    };

    const updatedList = users.map((u) => (u.id === targetUser.id ? updatedUser : u));
    saveUsers(updatedList);
    setCurrentUser(updatedUser);
    sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(updatedUser));

    // Clear any lockout
    setFailedAttempts(0);
    setLockUntil(null);
    setPendingRecoveryUserId(null);
    localStorage.removeItem(ATTEMPTS_STORAGE_KEY);

    if (!updatedUser.profession || !updatedUser.isProfessionSetupComplete) {
      setAuthModalMode('profession_setup');
      return { success: true, needsProfessionSetup: true };
    }

    setIsAuthModalOpen(false);
    return { success: true };
  };

  // Set User Profession handler
  const setUserProfession = async (
    profession: string,
    subProfession: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'No active user session found.' };
    }
    if (!profession || !profession.trim()) {
      return { success: false, error: 'Please select a primary profession/domain.' };
    }
    if (!subProfession || !subProfession.trim()) {
      return { success: false, error: 'Please select or enter your role specialization.' };
    }

    const updatedUser: UserAccount = {
      ...currentUser,
      profession: profession.trim(),
      subProfession: subProfession.trim(),
      isProfessionSetupComplete: true,
    };

    const updatedList = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    saveUsers(updatedList);
    setCurrentUser(updatedUser);
    sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(updatedUser));

    setIsAuthModalOpen(false);
    return { success: true };
  };

  // Forgot Password / Recovery handler
  const verifyRecovery = async (
    email: string,
    recoveryInput: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.trim().toLowerCase() === trimmedEmail);

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    const rawInput = recoveryInput.trim();
    // 1. Check if input matches mobile number (stripping spaces and dashes)
    const normalizedMobile = rawInput.replace(/[\s-]/g, '');
    const userMobile = user.mobileNumber.replace(/[\s-]/g, '');

    const isMobileMatch = normalizedMobile.length >= 7 && userMobile.includes(normalizedMobile);

    // 2. Check if input matches secret username (hashed verification salted with user's email)
    const normalizedUsername = normalizeSecretUsername(rawInput);
    const computedSecretHash = await sha256Hash(normalizedUsername, user.email.toLowerCase());
    const isSecretUsernameMatch = computedSecretHash === user.secretUsernameHash;

    if (isMobileMatch || isSecretUsernameMatch) {
      // Recovery verified!
      setPendingRecoveryUserId(user.id);
      setAuthModalMode('change_password');
      return { success: true };
    }

    return {
      success: false,
      error: 'Security verification failed. Mobile number or secret username did not match.',
    };
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem(CURRENT_USER_SESSION_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser && !currentUser.needsPasswordChange),
        isAuthModalOpen,
        authModalMode,
        failedAttempts,
        lockUntil,
        lockoutRemainingText,
        isLocked,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        login,
        changePassword,
        changePasswordWithCurrent,
        setUserProfession,
        verifyRecovery,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
