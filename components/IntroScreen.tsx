'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Crown, Sparkles as SparklesIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import Particles from '@/components/Particles';
import { birthdayConfig } from '@/config/birthday';
import { celebrationBlast, fireConfetti, fireFireworks } from '@/lib/confetti';
import { EASE } from '@/lib/motion';

/**
 * L'ouverture : écran noir, particules, la phrase d'introduction,
 * puis le nom lettre par lettre, puis le bouton surprise.
 * Au clic : explosion de particules, lumière rouge, couronne, transition.
 */
export default function IntroScreen({ onFinish }: { onFinish: () => void }) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(0); // 0 phrase · 1 nom · 2 surnom · 3 bouton
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    const base = reduced ? 300 : 1;
    const timers = [
      window.setTimeout(() => setStage(1), reduced ? base : 2600),
      window.setTimeout(() => setStage(2), reduced ? base + 200 : 4400),
      window.setTimeout(() => setStage(3), reduced ? base + 400 : 5400),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  const launch = useCallback(() => {
    if (launching) return;
    setLaunching(true);

    celebrationBlast();
    fireFireworks({ count: 4, duration: 2200 });
    window.setTimeout(() => fireConfetti({ x: 0.5, y: 0.35, count: 110, power: 17 }), 260);

    window.setTimeout(() => onFinish(), reduced ? 400 : 1750);
  }, [launching, onFinish, reduced]);

  const name = birthdayConfig.name.split('');

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-royal-black"
      exit={{ opacity: 0, scale: 1.12, filter: 'blur(12px)' }}
      transition={{ duration: 1, ease: EASE }}
    >
      {/* Fond : particules + halo rouge respirant */}
      <div className="absolute inset-0">
        <Particles density={1.15} parallax={false} />
      </div>
      <motion.div
        className="pointer-events-none absolute inset-0 radial-red"
        animate={reduced ? {} : { opacity: [0.45, 0.9, 0.45], scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="pointer-events-none absolute inset-0 vignette" />

      {/* Éclair de lumière rouge au lancement */}
      <AnimatePresence>
        {launching && (
          <>
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.95)_0%,rgba(220,38,38,0.85)_35%,transparent_70%)]"
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: [0, 1, 0], scale: [0.2, 2.4, 3.4] }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 0.5 }}
              style={{ background: 'rgba(255,255,255,0.9)' }}
            />
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center">
        {/* Couronne qui descend au lancement */}
        <AnimatePresence>
          {launching && (
            <motion.div
              className="absolute -top-24 left-1/2 -translate-x-1/2"
              initial={{ y: -160, opacity: 0, scale: 0.3, rotate: -30 }}
              animate={{ y: 0, opacity: 1, scale: 1.4, rotate: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Crown className="h-20 w-20 text-royal-gold drop-shadow-[0_0_30px_rgba(245,158,11,0.95)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phrase d'introduction */}
        <AnimatePresence>
          {stage >= 0 && stage < 3 && (
            <motion.p
              key="tagline"
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 1.4, ease: EASE }}
              className="mb-8 font-display text-lg tracking-[0.18em] text-white/70 sm:text-xl md:text-2xl"
            >
              <span className="text-royal-gold">✨</span> {birthdayConfig.introTagline}{' '}
              <span className="text-royal-gold">✨</span>
            </motion.p>
          )}
        </AnimatePresence>

        {/* Le nom, lettre par lettre */}
        <div className="relative">
          {stage >= 1 && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-full bg-royal-red/30 blur-[70px]"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <h1 className="flex flex-wrap items-center justify-center font-display text-5xl font-black leading-none tracking-tight sm:text-7xl md:text-8xl">
            {name.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60, rotateX: -90, filter: 'blur(12px)' }}
                animate={
                  stage >= 1
                    ? { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }
                    : { opacity: 0, y: 60, rotateX: -90, filter: 'blur(12px)' }
                }
                transition={{
                  duration: 0.9,
                  delay: stage >= 1 ? i * 0.09 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={char === ' ' ? 'w-4 sm:w-6' : 'text-gold-gradient glow-red'}
              >
                {char === ' ' ? ' ' : char}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* Le surnom */}
        <motion.div
          initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
          animate={
            stage >= 2 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 26 }
          }
          transition={{ duration: 1, ease: EASE }}
          className="mt-5 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-royal-gold/70 sm:w-14" />
          <p className="font-display text-base tracking-[0.3em] text-white/85 sm:text-xl">
            {birthdayConfig.nickname.toUpperCase()}
          </p>
          <motion.span
            animate={reduced ? {} : { rotate: [-8, 8, -8] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-xl sm:text-2xl"
          >
            👑
          </motion.span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-royal-gold/70 sm:w-14" />
        </motion.div>

        {/* Le bouton surprise */}
        <AnimatePresence>
          {stage >= 3 && !launching && (
            <motion.button
              key="cta"
              onClick={launch}
              initial={{ opacity: 0, scale: 0.7, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.6, filter: 'blur(10px)' }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="btn-royal mt-12 text-sm sm:text-base"
            >
              <SparklesIcon className="h-5 w-5" />
              {birthdayConfig.introButton}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Petit indice discret */}
        <AnimatePresence>
          {stage >= 3 && !launching && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-6 text-[11px] tracking-[0.25em] text-white"
            >
              APPUIE SUR LE BOUTON 🎁
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
