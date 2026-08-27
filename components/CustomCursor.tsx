'use client';

import { useEffect, useRef } from 'react';
import { useIsFinePointer } from '@/lib/hooks';

/**
 * Curseur personnalisé (desktop uniquement) :
 * un petit point rouge lumineux suivi d'un anneau doré qui grossit
 * au survol des photos et des boutons. Désactivé sur mobile/tablette.
 */
export default function CustomCursor() {
  const fine = useIsFinePointer();
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!fine) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor');

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let raf = 0;

    const INTERACTIVE = 'a, button, [role="button"], input, img, [data-cursor="hover"]';

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        rx = x;
        ry = y;
      }
      const target = e.target as HTMLElement | null;
      targetScale = target && target.closest(INTERACTIVE) ? 2.6 : 1;
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const onDown = () => {
      targetScale = Math.max(0.7, targetScale * 0.55);
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      scale += (targetScale - scale) * 0.14;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseleave', onLeave);
      document.body.classList.remove('custom-cursor');
    };
  }, [fine]);

  if (!fine) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] hidden md:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-2 w-2 rounded-full bg-royal-red opacity-0 transition-opacity duration-300"
        style={{ boxShadow: '0 0 12px 3px rgba(220,38,38,0.9)' }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-9 w-9 rounded-full border border-royal-gold/70 opacity-0 transition-opacity duration-300"
        style={{ boxShadow: '0 0 22px rgba(245,158,11,0.35), inset 0 0 14px rgba(220,38,38,0.35)' }}
      />
    </div>
  );
}
