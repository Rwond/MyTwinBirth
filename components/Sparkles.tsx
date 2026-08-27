'use client';

import { motion, useReducedMotion } from 'framer-motion';

type Spark = { x: number; y: number; size: number; delay: number; color: string };

/* Positions fixes (pas de Math.random) pour un rendu serveur/client identique. */
const SPARKS: Spark[] = [
  { x: 6, y: 12, size: 12, delay: 0, color: '#F59E0B' },
  { x: 92, y: 8, size: 9, delay: 0.6, color: '#FFFFFF' },
  { x: 14, y: 82, size: 10, delay: 1.2, color: '#DC2626' },
  { x: 88, y: 74, size: 13, delay: 0.3, color: '#F59E0B' },
  { x: 50, y: 3, size: 8, delay: 1.8, color: '#FFFFFF' },
  { x: 3, y: 46, size: 11, delay: 2.3, color: '#FCD34D' },
  { x: 97, y: 40, size: 10, delay: 1.5, color: '#DC2626' },
  { x: 44, y: 96, size: 9, delay: 0.9, color: '#F59E0B' },
  { x: 24, y: 28, size: 7, delay: 2.8, color: '#FFFFFF' },
  { x: 76, y: 20, size: 8, delay: 2.1, color: '#FCD34D' },
  { x: 68, y: 90, size: 7, delay: 3.2, color: '#FFFFFF' },
  { x: 30, y: 62, size: 8, delay: 1.05, color: '#F59E0B' },
];

function StarShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z"
        fill={color}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
}

/**
 * Étoiles scintillantes disposées autour d'un élément important.
 * À placer dans un parent en `position: relative`.
 */
export default function Sparkles({
  count = 10,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {SPARKS.slice(0, count).map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          initial={{ opacity: 0.15, scale: 0.6 }}
          animate={
            reduced
              ? { opacity: 0.5, scale: 1 }
              : { opacity: [0.15, 1, 0.15], scale: [0.6, 1.25, 0.6], rotate: [0, 90, 180] }
          }
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 3.2 + (i % 4) * 0.7, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }
          }
        >
          <StarShape size={s.size} color={s.color} />
        </motion.div>
      ))}
    </div>
  );
}
