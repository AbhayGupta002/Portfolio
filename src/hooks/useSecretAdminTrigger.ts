import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Secret Admin Access Hook
 * Enables stealth admin login methods while hiding all public login buttons:
 * 1. URL Hash / Query: Visiting /#admin or ?admin triggers the login modal.
 * 2. Hotkey: Pressing Ctrl+Shift+A (or Cmd+Shift+A on Mac) / Ctrl+Alt+L.
 * 3. Logo Tap: Triple-clicking the initials emblem (AG) within 1.2s.
 */
export function useSecretAdminTrigger() {
  const { openAuthModal, isAuthenticated } = useAuth();
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Secret URL Hash or Query Trigger (#admin or ?admin)
  useEffect(() => {
    const checkUrlTrigger = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (hash === '#admin' || hash === '#login' || search.includes('admin=true') || search.includes('admin')) {
        // Silently clear the hash/query to keep URL clean
        window.history.replaceState(null, '', window.location.pathname);
        if (!isAuthenticated) {
          openAuthModal('login');
        }
      }
    };

    checkUrlTrigger();
    window.addEventListener('hashchange', checkUrlTrigger);
    return () => window.removeEventListener('hashchange', checkUrlTrigger);
  }, [openAuthModal, isAuthenticated]);

  // 2. Secret Keyboard Shortcut (Ctrl+Shift+A or Cmd+Shift+A / Ctrl+Alt+L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl + Shift + A (Admin)
      const isShiftA = isCmdOrCtrl && e.shiftKey && (e.key === 'A' || e.key === 'a');
      // Cmd/Ctrl + Alt + L (Login)
      const isAltL = isCmdOrCtrl && e.altKey && (e.key === 'L' || e.key === 'l');

      if (isShiftA || isAltL) {
        e.preventDefault();
        openAuthModal('login');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openAuthModal]);

  // 3. Secret Triple-Click Handler (for mobile & desktop logo badge)
  const triggerSecretClick = (e?: React.MouseEvent) => {
    if (isAuthenticated) return;

    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 3) {
      if (e) e.preventDefault();
      clickCountRef.current = 0;
      openAuthModal('login');
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1200);
  };

  return { triggerSecretClick };
}
