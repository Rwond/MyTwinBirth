'use client';

import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Balloons from '@/components/Balloons';
import Sparkles from '@/components/Sparkles';
import { birthdayConfig, finale } from '@/config/birthday';
import { celebrationBlast, fireConfetti, fireFireworks } from '@/lib/confetti';
import { EASE } from '@/lib/motion';

const FLOATING = ['❤️', '🎈', '✨', '🎊', '👑', '🎉', '💛', '⭐'];

/** La grande finale : la question, la révélation, puis toute la fête. */
/* Année figée, dérivée de la configuration : une valeur calculée au rendu
   (new Date()) peut différer entre le serveur et le navigateur et casser
   l'hydratation React. */
const anneeAnniversaire = birthdayConfig.birthdayDate.slice(0, 4);

export default function FinalCelebration() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const [revealed, setRevealed] = useState(false);

  const party = useCallback(() => {
    celebrationBlast();
    fireFireworks({ count: 8, duration: 5200 });
    window.setTimeout(() => fireConfetti({ x: 0.5, y: 0.4, count: 120, power: 16 }), 700);
  }, []);

  useEffect(() => {
    if (!inView || revealed) return;
    const t = window.setTimeout(
      () => {
        setRevealed(true);
        party();
      },
      reduced ? 300 : 1500
    );
    return () => window.clearTimeout(t);
  }, [inView, revealed, party, reduced]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24"
    >
      <Balloons />

      {/* Lumière rouge pulsante */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.4)_0%,transparent_65%)]"
        animate={reduced ? {} : { opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Emojis qui montent doucement */}
      {!reduced && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {FLOATING.map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl sm:text-3xl"
              style={{ left: `${8 + i * 11}%`, bottom: '-10%' }}
              animate={{ y: ['0vh', '-115vh'], opacity: [0, 0.9, 0], rotate: [0, i % 2 ? 25 : -25] }}
              transition={{
                duration: 14 + i * 1.6,
                repeat: Infinity,
                delay: i * 1.7,
                ease: 'linear',
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      )}

      <div className="relative z-10 w-full max-w-3xl text-center">
        {/* La question */}
        <AnimatePresence>
          {!revealed && (
            <motion.h2
              key="question"
              initial={{ opacity: 0, scale: 0.7, filter: 'blur(18px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.5, filter: 'blur(16px)' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="font-display text-3xl font-black tracking-tight text-white glow-red sm:text-5xl"
            >
              🎉 {finale.question} 🎉
            </motion.h2>
          )}
        </AnimatePresence>

        {/* La révélation */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, ease: EASE, delay: 0.1 }}
                className="text-gold-gradient font-display text-2xl font-black tracking-[0.15em] sm:text-5xl"
              >
                {finale.line1}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, scale: 0.6, filter: 'blur(18px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ type: 'spring', stiffness: 150, damping: 14, delay: 0.5 }}
                className="text-red-gradient glow-red mt-3 font-display text-4xl font-black leading-none sm:text-7xl"
              >
                {finale.line2}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
                className="mt-4 font-display text-sm tracking-[0.3em] text-white/85 sm:text-xl"
              >
                {finale.line3}
              </motion.p>

              {/* Le grand 1 */}
              <div className="relative mt-10 flex h-48 w-48 items-center justify-center sm:h-64 sm:w-64">
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-royal-red/40 blur-[60px]"
                  animate={reduced ? {} : { scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-4 rounded-full border-2 border-royal-gold/30"
                  animate={reduced ? {} : { rotate: 360, scale: [1, 1.05, 1] }}
                  transition={{
                    rotate: { duration: 24, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  style={{ borderStyle: 'dashed' }}
                />
                <motion.span
                  initial={{ scale: 0, rotate: -180, filter: 'blur(30px)' }}
                  animate={{ scale: 1, rotate: 0, filter: 'blur(0px)' }}
                  transition={{ type: 'spring', stiffness: 110, damping: 13, delay: 1.2 }}
                  className="text-gold-gradient glow-red font-display text-[9rem] font-black leading-none sm:text-[13rem]"
                >
                  {birthdayConfig.age}
                </motion.span>
                <Sparkles count={12} className="-m-6" />
              </div>

              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={party}
                className="btn-royal mt-4 text-sm sm:text-base"
              >
                <PartyPopper className="h-5 w-5" />
                {finale.button}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pied de page */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute inset-x-0 bottom-0 z-10 pb-6 text-center"
      >
        <div className="gold-divider mx-auto mb-4 w-40" />
        <p className="text-[11px] tracking-[0.25em] text-white/30">
          FAIT AVEC ❤️ POUR {birthdayConfig.name} · {anneeAnniversaire}
        </p>
      </motion.footer>
    </section>
  );
}
