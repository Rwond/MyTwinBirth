'use client';

import { useReducedMotion } from 'framer-motion';
import type { CSSProperties } from 'react';

type BalloonConf = {
  left: string;
  color: string;
  highlight: string;
  size: number;
  delay: number;
  duration: number;
  sway: number;
};

/* Valeurs fixes (et non aléatoires) : le rendu serveur et le rendu client
   restent identiques, donc pas d'avertissement d'hydratation. */
const BALLOONS: BalloonConf[] = [
  { left: '6%', color: '#DC2626', highlight: '#FCA5A5', size: 58, delay: 0, duration: 19, sway: 18 },
  { left: '18%', color: '#F59E0B', highlight: '#FDE68A', size: 44, delay: 4.5, duration: 23, sway: -14 },
  { left: '31%', color: '#FFFFFF', highlight: '#FFFFFF', size: 38, delay: 9, duration: 21, sway: 12 },
  { left: '46%', color: '#DC2626', highlight: '#FCA5A5', size: 66, delay: 2.5, duration: 26, sway: -20 },
  { left: '61%', color: '#F59E0B', highlight: '#FDE68A', size: 50, delay: 12, duration: 20, sway: 16 },
  { left: '74%', color: '#7F1D1D', highlight: '#EF4444', size: 42, delay: 6.5, duration: 24, sway: -12 },
  { left: '88%', color: '#DC2626', highlight: '#FCA5A5', size: 54, delay: 15, duration: 22, sway: 14 },
];

function Balloon({ conf }: { conf: BalloonConf }) {
  const { left, color, highlight, size, delay, duration, sway } = conf;
  return (
    <div
      className="absolute bottom-0"
      style={
        {
          left,
          animation: `balloonRise ${duration}s linear ${delay}s infinite`,
          '--sway': `${sway}px`,
        } as CSSProperties
      }
    >
      <svg width={size} height={size * 1.55} viewBox="0 0 60 93" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id={`bg-${left.replace('%', '')}`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={highlight} stopOpacity="0.95" />
            <stop offset="45%" stopColor={color} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <ellipse cx="30" cy="33" rx="26" ry="32" fill={`url(#bg-${left.replace('%', '')})`} />
        <path d="M30 65 l-5 7 h10 z" fill={color} opacity="0.9" />
        <path
          d="M30 72 q7 9 0 17 q-7 8 0 4"
          stroke="rgba(245,158,11,0.55)"
          strokeWidth="1.2"
          fill="none"
        />
        <ellipse cx="21" cy="22" rx="6" ry="9" fill="#ffffff" opacity="0.35" />
      </svg>
    </div>
  );
}

/**
 * Ballons qui montent doucement à l'arrière-plan (pur CSS : très léger).
 */
export default function Balloons({
  count = BALLOONS.length,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {BALLOONS.slice(0, count).map((conf) => (
        <Balloon key={conf.left} conf={conf} />
      ))}
      <style jsx global>{`
        @keyframes balloonRise {
          0% {
            transform: translate3d(0, 20vh, 0) rotate(-5deg);
            opacity: 0;
          }
          8% {
            opacity: 0.85;
          }
          50% {
            transform: translate3d(var(--sway, 15px), -60vh, 0) rotate(5deg);
          }
          92% {
            opacity: 0.7;
          }
          100% {
            transform: translate3d(0, -135vh, 0) rotate(-3deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
