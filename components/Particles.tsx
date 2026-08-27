'use client';

import { useEffect, useRef } from 'react';

type ParticlesProps = {
  /** Densité des particules (1 = normal) */
  density?: number;
  className?: string;
  /** Le fond réagit-il à la souris et au scroll ? */
  parallax?: boolean;
  opacity?: number;
};

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  sprite: number;
  phase: number;
  speed: number;
  depth: number;
  twinkle: number;
};

const COLORS = ['#DC2626', '#F59E0B', '#FFFFFF'];

/**
 * Fond de particules rouges, dorées et blanches (Canvas).
 * Chaque couleur est pré-dessinée une fois dans un petit sprite : le rendu
 * reste fluide même sur téléphone, malgré le halo lumineux.
 */
export default function Particles({
  density = 1,
  className = '',
  parallax = true,
  opacity = 1,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    let dots: Dot[] = [];
    let raf = 0;
    let running = true;

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let scrollY = window.scrollY;

    // --- Sprites lumineux (un par couleur) ---
    const sprites = COLORS.map((color) => {
      const size = 64;
      const s = document.createElement('canvas');
      s.width = size;
      s.height = size;
      const sctx = s.getContext('2d');
      if (sctx) {
        const g = sctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        g.addColorStop(0, color);
        g.addColorStop(0.25, color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        sctx.fillStyle = g;
        sctx.beginPath();
        sctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        sctx.fill();
      }
      return s;
    });

    const build = () => {
      const base = Math.round((w * h) / 24000);
      const count = Math.max(18, Math.min(120, Math.round(base * density)));
      dots = Array.from({ length: count }, () => {
        const depth = 0.35 + Math.random() * 0.9;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.16,
          vy: -(0.08 + Math.random() * 0.32),
          r: (1.1 + Math.random() * 3.4) * depth,
          sprite: Math.random() < 0.45 ? 0 : Math.random() < 0.65 ? 1 : 2,
          phase: Math.random() * Math.PI * 2,
          speed: 0.004 + Math.random() * 0.012,
          depth,
          twinkle: 0.35 + Math.random() * 0.65,
        };
      });
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const onMouse = (e: MouseEvent) => {
      if (!parallax) return;
      mouse.tx = (e.clientX / w - 0.5) * 26;
      mouse.ty = (e.clientY / h - 0.5) * 26;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        raf = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    let lastFrame = performance.now();

    const draw = (now?: number) => {
      const time = now ?? performance.now();
      // Vitesse identique quel que soit le nombre d'images par seconde
      const dt = Math.min(Math.max((time - lastFrame) / 16.667, 0.2), 3);
      lastFrame = time;

      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      const scrollShift = parallax ? (scrollY % (h * 2)) * 0.03 : 0;

      ctx.globalCompositeOperation = 'lighter';

      for (const d of dots) {
        if (!reduced) {
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          d.phase += d.speed * dt;
        }

        if (d.y < -30) {
          d.y = h + 20;
          d.x = Math.random() * w;
        }
        if (d.x < -30) d.x = w + 20;
        if (d.x > w + 30) d.x = -20;

        const wobble = Math.sin(d.phase) * 14 * d.depth;
        const alpha = (0.25 + Math.abs(Math.sin(d.phase * 1.7)) * d.twinkle * 0.75) * opacity;
        const px = d.x + wobble + mouse.x * d.depth;
        const py = d.y - scrollShift * d.depth + mouse.y * d.depth;
        const size = d.r * 7;

        ctx.globalAlpha = Math.min(1, alpha);
        ctx.drawImage(sprites[d.sprite], px - size / 2, py - size / 2, size, size);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      if (running) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density, parallax, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
