'use client';

import { useEffect, useRef } from 'react';
import { ConfettiEngine, registerConfettiEngine } from '@/lib/confetti';

/**
 * Canvas plein écran, monté une seule fois dans le layout.
 * Tous les autres composants déclenchent les confettis via :
 *   fireConfetti(), fireFireworks(), celebrationBlast()
 */
export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const engine = new ConfettiEngine(canvas, mql.matches);
    registerConfettiEngine(engine);

    const onMotionChange = () => engine.setReduced(mql.matches);
    mql.addEventListener('change', onMotionChange);
    window.addEventListener('resize', engine.resize);

    return () => {
      mql.removeEventListener('change', onMotionChange);
      window.removeEventListener('resize', engine.resize);
      engine.destroy();
      registerConfettiEngine(null);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] h-full w-full"
    />
  );
}
