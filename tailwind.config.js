/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#ECF0F1',
        neo: '#BDC3C7',
        'slate-dark': '#2C3D50',
        'slate-muted': '#33495D',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        handwriting: ['Caveat', 'Kalam', 'cursive', 'sans-serif'],
      },
      boxShadow: {
        'neo-card': '12px 12px 28px rgba(189, 195, 199, 0.45), -12px -12px 28px rgba(255, 255, 255, 0.9)',
        'neo-card-hover': '16px 16px 36px rgba(189, 195, 199, 0.55), -14px -14px 32px rgba(255, 255, 255, 0.95)',
        'neo-inset': 'inset 2px 2px 6px rgba(189, 195, 199, 0.35), inset -2px -2px 6px rgba(255, 255, 255, 0.9)',
        'neo-pill': '6px 6px 16px rgba(189, 195, 199, 0.35), -6px -6px 16px rgba(255, 255, 255, 0.85)',
      },
    },
  },
  plugins: [],
};
