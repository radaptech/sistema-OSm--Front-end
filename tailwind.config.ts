import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Big Shoulders"', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        marca: {
          950: '#0f2916',
          900: '#173a21',
          800: '#1f4e2c',
          600: '#2f6e42',
          500: '#4bae70',
          300: '#8ed3a4',
          100: '#e4f6e9',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 41, 22, 0.04), 0 10px 24px -14px rgba(15, 41, 22, 0.35)',
        'card-hover':
          '0 2px 4px rgba(15, 41, 22, 0.06), 0 20px 36px -16px rgba(15, 41, 22, 0.45)',
        pop: '0 24px 60px -20px rgba(15, 41, 22, 0.55)',
      },
      backgroundImage: {
        'grade-industrial':
          'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        grade: '28px 28px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'pop-in': {
          from: { opacity: '0', transform: 'scale(0.96) translateY(4px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.15s ease-out',
        'pop-in': 'pop-in 0.18s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
