import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './config/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          red: '#DC2626',
          dark: '#7F1D1D',
          deep: '#450A0A',
          black: '#050505',
          coal: '#111111',
          white: '#FFFFFF',
          gold: '#F59E0B',
          goldsoft: '#FCD34D',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(220,38,38,0.45)',
        'glow-lg': '0 0 90px rgba(220,38,38,0.55)',
        gold: '0 0 30px rgba(245,158,11,0.45)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(2deg)' },
        },
        floatSlow: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        twinkle: {
          '0%,100%': { opacity: '0.2', transform: 'scale(0.7)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        riseBalloon: {
          '0%': { transform: 'translateY(110vh) rotate(-6deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-30vh) rotate(6deg)', opacity: '0' },
        },
        heartbeat: {
          '0%,100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.12)' },
          '40%': { transform: 'scale(0.98)' },
          '60%': { transform: 'scale(1.08)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 9s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        shimmer: 'shimmer 5s linear infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        'spin-slow': 'spinSlow 26s linear infinite',
        'spin-slower': 'spinSlow 60s linear infinite',
        balloon: 'riseBalloon 18s linear infinite',
        heartbeat: 'heartbeat 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
