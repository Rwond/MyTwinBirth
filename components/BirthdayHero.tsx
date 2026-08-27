'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Crown, Heart } from 'lucide-react';
import { useRef } from 'react';
import Balloons from '@/components/Balloons';
import RoyalPhoto from '@/components/RoyalPhoto';
import Sparkles from '@/components/Sparkles';
import { birthdayConfig } from '@/config/birthday';
import { EASE } from '@/lib/motion';

export default function BirthdayHero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-45%']);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      id="accueil"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 sm:pt-32"
    >
      {/* Halos et ballons */}
      <div className="pointer-events-none absolute inset-0 radial-red" />
      <Balloons count={5} />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[85vmin] w-[85vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(220,38,38,0.22) 0%, rgba(127,29,29,0.12) 40%, transparent 70%)',
        }}
        animate={reduced ? {} : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div style={{ opacity: fade }} className="relative z-10 w-full max-w-5xl">
        {/* Titre */}
        <motion.div style={{ y: textY }} className="text-center">
          <motion.p
            initial={{ opacity: 0, y: -20, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.25em' }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
            className="mb-3 text-xs font-semibold tracking-[0.25em] text-royal-gold sm:text-sm"
          >
            🎉 {birthdayConfig.heroTitle} 🎉
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(16px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.35 }}
            className="text-red-gradient glow-red font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl"
          >
            {birthdayConfig.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.7 }}
            className="mt-4 flex items-center justify-center gap-3"
          >
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-royal-gold/60 sm:w-20" />
            <p className="font-display text-sm tracking-[0.28em] text-white/85 sm:text-lg">
              {birthdayConfig.nickname.toUpperCase()}
            </p>
            <motion.span
              animate={reduced ? {} : { y: [-2, -8, -2], rotate: [-6, 6, -6] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              className="text-lg sm:text-2xl"
            >
              👑
            </motion.span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-royal-gold/60 sm:w-20" />
          </motion.div>
        </motion.div>

        {/* La photo dans son cadre royal */}
        <motion.div
          style={{ y: photoY, scale }}
          initial={{ opacity: 0, scale: 0.8, rotate: -3, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.55 }}
          className="relative mx-auto mt-10 w-[min(78vw,340px)] sm:mt-12 sm:w-[380px]"
        >
          {/* Couronne posée sur le cadre */}
          <motion.div
            className="absolute -top-9 left-1/2 z-20 -translate-x-1/2"
            animate={reduced ? {} : { y: [0, -7, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Crown className="h-12 w-12 text-royal-gold drop-shadow-[0_0_22px_rgba(245,158,11,0.9)] sm:h-14 sm:w-14" />
          </motion.div>

          {/* Anneau lumineux tournant */}
          <motion.div
            aria-hidden="true"
            className="absolute -inset-6 rounded-[2.5rem] opacity-70"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(245,158,11,0.55) 60deg, transparent 130deg, rgba(220,38,38,0.6) 220deg, transparent 300deg)',
              filter: 'blur(22px)',
            }}
            animate={reduced ? {} : { rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          />

          {/* Halo rouge */}
          <div className="pointer-events-none absolute -inset-10 rounded-full bg-royal-red/25 blur-[60px]" />

          <div className="royal-frame relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.35rem] bg-royal-coal">
              <RoyalPhoto
                src={birthdayConfig.heroPhoto}
                alt={`${birthdayConfig.name}, ${birthdayConfig.nickname}`}
                priority
                sizes="(max-width: 640px) 78vw, 380px"
              />
              {/* Lumière animée qui balaie la photo */}
              {!reduced && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%)',
                  }}
                  animate={{ x: ['-120%', '120%'] }}
                  transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
          </div>

          <Sparkles count={12} className="-m-8" />

          {/* Badge « 1 AN » */}
          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: -10 }}
            transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 1.5 }}
            className="absolute -bottom-6 -right-3 z-20 sm:-right-8"
          >
            <motion.div
              animate={reduced ? {} : { scale: [1, 1.08, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-royal-gold bg-gradient-to-br from-royal-red via-royal-dark to-black shadow-[0_0_45px_rgba(220,38,38,0.75)] sm:h-28 sm:w-28"
            >
              <span className="font-display text-4xl font-black leading-none text-white glow-white sm:text-5xl">
                {birthdayConfig.age}
              </span>
              <span className="text-[10px] font-bold tracking-[0.3em] text-royal-gold sm:text-xs">
                AN
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Phrase du hero */}
        <motion.p
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: EASE, delay: 1.7 }}
          className="mx-auto mt-14 flex max-w-xl flex-wrap items-center justify-center gap-2 text-center font-display text-base text-white/80 sm:mt-16 sm:text-xl"
        >
          {birthdayConfig.heroSubtitle}
          <Heart className="h-5 w-5 shrink-0 animate-heartbeat fill-royal-red text-royal-red" />
        </motion.p>
      </motion.div>

      {/* Indicateur de scroll */}
      <motion.div
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center"
      >
        <p className="mb-1 text-[10px] tracking-[0.3em] text-white/40">FAIS DÉFILER</p>
        <motion.div
          animate={reduced ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="mx-auto h-5 w-5 text-royal-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
