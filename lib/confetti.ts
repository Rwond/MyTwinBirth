/* ============================================================================
   Petit moteur de confettis / feux d'artifice en Canvas.
   Léger, sans dépendance, et pilotable depuis n'importe quel composant :

     import { fireConfetti, fireFireworks } from '@/lib/confetti';
     fireConfetti({ x: 0.5, y: 0.4, count: 120 });
   ========================================================================== */

export type ConfettiOptions = {
  /** position en ratio de l'écran (0 -> 1) */
  x?: number;
  y?: number;
  count?: number;
  spread?: number;
  power?: number;
  colors?: string[];
  /** ajoute des emojis dans la volée */
  emojis?: string[];
  gravity?: number;
  scalar?: number;
};

export type FireworksOptions = {
  count?: number;
  duration?: number;
  colors?: string[];
};

export const ROYAL_COLORS = ['#DC2626', '#F59E0B', '#FFFFFF', '#FCD34D', '#7F1D1D', '#FEE2E2'];

type Shape = 'rect' | 'circle' | 'star' | 'emoji' | 'spark';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vr: number;
  life: number;
  maxLife: number;
  gravity: number;
  drag: number;
  shape: Shape;
  emoji?: string;
  wobble: number;
  vw: number;
};

type Rocket = {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  trail: { x: number; y: number }[];
};

const TAU = Math.PI * 2;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class ConfettiEngine {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private particles: Particle[] = [];
  private rockets: Rocket[] = [];
  private timers: number[] = [];
  private raf = 0;
  private running = false;
  private dpr = 1;
  private reduced = false;
  private lastFrame = 0;

  constructor(canvas: HTMLCanvasElement, reduced = false) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.reduced = reduced;
    this.resize();
  }

  setReduced(v: boolean) {
    this.reduced = v;
  }

  resize = () => {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(window.innerWidth * this.dpr);
    this.canvas.height = Math.floor(window.innerHeight * this.dpr);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  };

  get w() {
    return this.canvas.width / this.dpr;
  }

  get h() {
    return this.canvas.height / this.dpr;
  }

  private later(fn: () => void, delay: number) {
    const id = window.setTimeout(fn, delay);
    this.timers.push(id);
  }

  fire(opts: ConfettiOptions = {}) {
    const {
      x = 0.5,
      y = 0.45,
      spread = 360,
      power = 13,
      colors = ROYAL_COLORS,
      emojis = [],
      gravity = 0.28,
      scalar = 1,
    } = opts;

    let count = opts.count ?? 90;
    if (this.reduced) count = Math.min(count, 16);
    if (this.w < 640) count = Math.round(count * 0.65);

    const ox = x * this.w;
    const oy = y * this.h;
    const base = -Math.PI / 2;
    const spreadRad = (spread * Math.PI) / 180;
    const shapes: Shape[] = ['rect', 'rect', 'circle', 'star'];

    for (let i = 0; i < count; i++) {
      const angle = base + rand(-spreadRad / 2, spreadRad / 2);
      const speed = rand(power * 0.35, power) * (this.w < 640 ? 0.85 : 1);
      const useEmoji = emojis.length > 0 && Math.random() < 0.22;
      this.particles.push({
        x: ox + rand(-8, 8),
        y: oy + rand(-8, 8),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: useEmoji ? rand(16, 30) * scalar : rand(5, 12) * scalar,
        color: pick(colors),
        rotation: rand(0, TAU),
        vr: rand(-0.28, 0.28),
        life: 0,
        maxLife: rand(90, 190),
        gravity,
        drag: 0.985,
        shape: useEmoji ? 'emoji' : pick(shapes),
        emoji: useEmoji ? pick(emojis) : undefined,
        wobble: rand(0, TAU),
        vw: rand(0.04, 0.13),
      });
    }
    this.start();
  }

  /** Pluie de confettis depuis le haut de l'écran */
  rain(count = 70, duration = 2600) {
    if (this.reduced) return;
    const each = Math.max(1, Math.round(count / 14));
    const shapes: Shape[] = ['rect', 'circle', 'star'];
    let elapsed = 0;
    const step = 180;

    const tick = () => {
      for (let i = 0; i < each; i++) {
        this.particles.push({
          x: rand(0, this.w),
          y: rand(-60, -10),
          vx: rand(-1.2, 1.2),
          vy: rand(1.5, 4),
          size: rand(5, 11),
          color: pick(ROYAL_COLORS),
          rotation: rand(0, TAU),
          vr: rand(-0.2, 0.2),
          life: 0,
          maxLife: 400,
          gravity: 0.045,
          drag: 0.995,
          shape: pick(shapes),
          wobble: rand(0, TAU),
          vw: rand(0.03, 0.1),
        });
      }
      this.start();
      elapsed += step;
      if (elapsed < duration) this.later(tick, step);
    };

    tick();
  }

  fireworks(opts: FireworksOptions = {}) {
    const { count = 6, duration = 4200, colors = ROYAL_COLORS } = opts;
    if (this.reduced) return;
    const n = this.w < 640 ? Math.max(3, Math.round(count * 0.6)) : count;

    for (let i = 0; i < n; i++) {
      this.later(
        () => {
          this.rockets.push({
            x: rand(this.w * 0.12, this.w * 0.88),
            y: this.h + 10,
            targetY: rand(this.h * 0.12, this.h * 0.45),
            vy: rand(-14, -9),
            color: pick(colors),
            trail: [],
          });
          this.start();
        },
        (i * duration) / n + rand(0, 260)
      );
    }
  }

  private explode(x: number, y: number, color: string) {
    const count = this.w < 640 ? 44 : 70;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * TAU + rand(-0.08, 0.08);
      const speed = rand(2.5, 8.5);
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: rand(1.6, 3.4),
        color: Math.random() < 0.25 ? '#FFFFFF' : color,
        rotation: 0,
        vr: 0,
        life: 0,
        maxLife: rand(55, 95),
        gravity: 0.085,
        drag: 0.955,
        shape: 'spark',
        wobble: 0,
        vw: 0,
      });
    }
  }

  private start() {
    if (this.running) return;
    this.running = true;
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  private drawStar(ctx: CanvasRenderingContext2D, r: number) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * TAU) / 5 - Math.PI / 2;
      const a2 = a + TAU / 10;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      ctx.lineTo(Math.cos(a2) * r * 0.45, Math.sin(a2) * r * 0.45);
    }
    ctx.closePath();
    ctx.fill();
  }

  private loop = (now?: number) => {
    const ctx = this.ctx;
    const time = now ?? performance.now();
    // Physique basée sur le temps réel : la fête dure pareil sur un vieux
    // téléphone comme sur un ordinateur rapide (dt plafonné à 3 images).
    const dt = Math.min(Math.max((time - this.lastFrame) / 16.667, 0.2), 3);
    this.lastFrame = time;

    ctx.clearRect(0, 0, this.w, this.h);

    // Fusées
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.y += r.vy * dt;
      r.vy += 0.16 * dt;
      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > 12) r.trail.shift();

      ctx.save();
      for (let t = 0; t < r.trail.length; t++) {
        const p = r.trail[t];
        ctx.globalAlpha = (t / r.trail.length) * 0.7;
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.1, 0, TAU);
        ctx.fill();
      }
      ctx.restore();

      if (r.y <= r.targetY || r.vy >= 0) {
        this.explode(r.x, r.y, r.color);
        this.rockets.splice(i, 1);
      }
    }

    // Particules
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      p.vy += p.gravity * dt;
      p.vx *= Math.pow(p.drag, dt);
      p.vy *= Math.pow(p.drag, dt);
      p.wobble += p.vw * dt;
      p.x += (p.vx + Math.sin(p.wobble) * 0.7) * dt;
      p.y += p.vy * dt;
      p.rotation += p.vr * dt;

      const alpha = 1 - p.life / p.maxLife;
      if (alpha <= 0 || p.y > this.h + 80) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 1.25));
      ctx.translate(p.x, p.y);

      if (p.shape === 'spark') {
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, TAU);
        ctx.fill();
      } else if (p.shape === 'emoji') {
        ctx.rotate(p.rotation);
        ctx.font = String(Math.round(p.size)) + 'px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji || '*', 0, 0);
      } else {
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, TAU);
          ctx.fill();
        } else if (p.shape === 'star') {
          this.drawStar(ctx, p.size * 0.72);
        } else {
          // rectangle qui « tourne » sur lui-même
          const squeeze = Math.abs(Math.cos(p.wobble));
          ctx.fillRect(-p.size / 2, (-p.size * squeeze) / 2, p.size, p.size * squeeze * 0.62);
        }
      }
      ctx.restore();
    }

    if (this.particles.length === 0 && this.rockets.length === 0) {
      this.running = false;
      ctx.clearRect(0, 0, this.w, this.h);
      return;
    }
    this.raf = requestAnimationFrame(this.loop);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.timers.forEach((id) => window.clearTimeout(id));
    this.timers = [];
    this.particles = [];
    this.rockets = [];
    this.running = false;
  }
}

/* --- Accès global (le canvas n'est monté qu'une seule fois, dans <Confetti />) --- */

let engine: ConfettiEngine | null = null;

export function registerConfettiEngine(e: ConfettiEngine | null) {
  engine = e;
}

export function fireConfetti(opts?: ConfettiOptions) {
  engine?.fire(opts);
}

export function rainConfetti(count?: number, duration?: number) {
  engine?.rain(count, duration);
}

export function fireFireworks(opts?: FireworksOptions) {
  engine?.fireworks(opts);
}

/** La grande volée : explosion centrale + deux canons latéraux + pluie dorée */
export function celebrationBlast() {
  if (!engine) return;
  const emojis = ['🎉', '🎊', '✨', '👑', '❤️'];
  fireConfetti({ x: 0.5, y: 0.5, count: 140, spread: 360, power: 15, emojis });
  window.setTimeout(
    () => fireConfetti({ x: 0.02, y: 0.85, count: 70, spread: 70, power: 20, emojis }),
    180
  );
  window.setTimeout(
    () => fireConfetti({ x: 0.98, y: 0.85, count: 70, spread: 70, power: 20, emojis }),
    320
  );
  window.setTimeout(() => rainConfetti(90, 3000), 500);
}
