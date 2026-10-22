import { useEffect } from 'react';

/**
 * Robust Body Scroll Lock Hook
 * Prevents the background page from scrolling when a modal, dialog, or drawer is active.
 * Handles desktop scrollbar jumps and mobile iOS/Android touch overscroll.
 */
let activeLockCount = 0;
let originalBodyOverflow = '';
let originalHtmlOverflow = '';
let originalBodyTouchAction = '';

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    if (activeLockCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      originalHtmlOverflow = document.documentElement.style.overflow;
      originalBodyTouchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }

    activeLockCount++;

    return () => {
      activeLockCount = Math.max(0, activeLockCount - 1);
      if (activeLockCount === 0) {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.touchAction = originalBodyTouchAction;
      }
    };
  }, [isLocked]);
}
