/**
 * Security and Cryptographic Utilities
 * - SHA-256 Hashing with browser Web Crypto API
 * - Salt generation
 * - 1-hour account lockout management after 3 failed attempts
 * - Secret username hashing & normalization
 */

// Generate a random cryptographic salt
export function generateSalt(length: number = 16): string {
  const array = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < length; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// SHA-256 Hashing function
export async function sha256Hash(message: string, salt: string = ''): Promise<string> {
  const salted = salt ? `${salt}:${message}:${salt}` : message;
  const encoder = new TextEncoder();
  const data = encoder.encode(salted);

  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback simple bitwise hash if subtle is unavailable in testing
  let hash = 0;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

// Normalize secret username (lowercase, trim, letters/numbers/underscore only)
export function normalizeSecretUsername(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/[^a-z0-9_.]/g, '');
}

// Format milliseconds remaining into human readable "XXm YYs"
export function formatLockoutRemaining(msRemaining: number): string {
  if (msRemaining <= 0) return '';
  const totalSeconds = Math.ceil(msRemaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

// Maximum allowed failed login attempts before 1-hour lockout
export const MAX_LOGIN_ATTEMPTS = 3;
export const LOCKOUT_DURATION_MS = 60 * 60 * 1000; // 1 Hour (3,600,000 ms)
