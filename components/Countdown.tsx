'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Clock, Hourglass, Sparkles as SparklesIcon, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Reveal from '@/components/Reveal';
import Sparkles from '@/components/Sparkles';
import { birthdayConfig } from '@/config/birthday';
import { EASE } from '@/lib/motion';

const nf = new Intl.NumberFormat('fr-FR');

/** Nombre de jours (entiers) qui séparent aujourd'hui du grand jour. */
function daysUntilBirthday(): number {
  const target = new Date(birthdayConfig.birthdayDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

/** Compteur qui monte progressivement quand il entre à l'écran. */
function AnimatedNumber({ value, duration = 2200 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {nf.format(display)}
    </span>
  );
}

export default function Countdown() {
  const reduced = useReducedMotion();
  const years = birthdayConfig.age;
  const days = 365 * years;

  /* Calculé côté navigateur : le compte à rebours reste juste, même
     plusieurs jours après la mise en ligne. */
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  useEffect(() => {
    setDaysLeft(daysUntilBirthday());
    const id = window.setInterval(() => setDaysLeft(daysUntilBirthday()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const stats = [
    { value: days, label: 'jours', icon: Sun, accent: 'text-royal-gold' },
    { value: days * 24, label: 'heures', icon: Clock, accent: 'text-royal-red' },
    { value: days * 24 * 60, label: 'minutes', icon: Hourglass, accent: 'text-white' },
    { value: days * 24 * 60 * 60, label: 'secondes', icon: SparklesIcon, accent: 'text-royal-gold' },
  ];

  return (
    <section className="section-pad relative overflow-hidden px-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(127,29,29,0.25),transparent_65%)]" />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Le grand chiffre */}
        <div className="relative mx-auto flex h-52 w-52 items-center justify-center sm:h-72 sm:w-72">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(245,158,11,0.5), rgba(220,38,38,0.6), rgba(245,158,11,0.5))',
              filter: 'blur(30px)',
            }}
            animate={reduced ? {} : { rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            initial={{ scale: 0.2, opacity: 0, rotate: -25, filter: 'blur(28px)' }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: 'spring', stiffness: 130, damping: 14 }}
            className="relative"
          >
            <motion.span
              animate={reduced ? {} : { scale: [1, 1.06, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-gold-gradient glow-red block font-display text-[10rem] font-black leading-none sm:text-[15rem]"
            >
              {years}
            </motion.span>
          </motion.div>
          <Sparkles count={10} className="-m-8" />
        </div>

        <Reveal variant="blurIn" delay={0.1}>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-[0.25em] text-white sm:text-4xl">
            UNE ANNÉE D&apos;EXISTENCE
          </h2>
        </Reveal>

        <Reveal variant="fadeIn" delay={0.2}>
          <div className="gold-divider mx-auto mt-8 w-40" />
        </Reveal>

        {/* Les chiffres */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
                whileHover={reduced ? {} : { y: -6, scale: 1.03 }}
                className="royal-card group relative overflow-hidden p-5 sm:p-6"
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-royal-red/20 blur-2xl transition-all duration-500 group-hover:bg-royal-red/40" />
                <Icon className={`mx-auto mb-3 h-5 w-5 ${s.accent} opacity-80`} />
                <p className="font-display text-2xl font-black text-white sm:text-3xl">
                  <AnimatedNumber value={s.value} duration={1800 + i * 400} />
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-white/45">
                  {s.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        <Reveal variant="fadeUp" delay={0.15}>
          <p className="mt-10 text-sm text-white/50 sm:text-base">
            ... et chacune de ces secondes a été remplie d&apos;amour. ❤️
          </p>
        </Reveal>

        {/* Le compte à rebours vers le grand jour */}
        {daysLeft !== null && daysLeft > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="royal-card mx-auto mt-10 inline-flex flex-col items-center gap-1 px-8 py-5"
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-royal-gold">
              Le grand jour approche
            </span>
            <span className="font-display text-3xl font-black text-white glow-red sm:text-4xl">
              J − {daysLeft}
            </span>
            <span className="text-xs text-white/50">
              {daysLeft === 1 ? 'Plus qu’un jour' : `Plus que ${daysLeft} jours`} avant ses 1 an 🎂
            </span>
          </motion.div>
        )}

        {daysLeft === 0 && (
          <motion.p
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 13 }}
            className="text-gold-gradient mt-10 font-display text-2xl font-black tracking-[0.15em] sm:text-4xl"
          >
            🎉 C&apos;EST AUJOURD&apos;HUI ! 🎉
          </motion.p>
        )}
      </div>
    </section>
  );
}
