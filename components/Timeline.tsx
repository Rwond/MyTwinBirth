'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Crown } from 'lucide-react';
import { useRef } from 'react';
import RoyalPhoto from '@/components/RoyalPhoto';
import Reveal from '@/components/Reveal';
import { timeline } from '@/config/birthday';
import { EASE } from '@/lib/motion';

/** La timeline de la première année : elle se construit pendant le scroll. */
export default function Timeline() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 55%'],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="souvenirs" className="section-pad relative overflow-hidden px-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(127,29,29,0.12),transparent)]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-16 text-center sm:mb-24">
          <Reveal variant="scaleIn">
            <Crown className="mx-auto mb-4 h-9 w-9 text-royal-gold drop-shadow-[0_0_18px_rgba(245,158,11,0.8)]" />
          </Reveal>
          <Reveal variant="fadeUp" delay={0.1}>
            <h2 className="text-gold-gradient font-display text-4xl font-bold tracking-tight sm:text-6xl">
              L&apos;année du Prince
            </h2>
          </Reveal>
          <Reveal variant="fadeIn" delay={0.2}>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/50 sm:text-base">
              Douze mois, mille souvenirs. Voici les plus belles étapes de sa toute première année.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative">
          {/* La ligne verticale */}
          <div className="absolute left-[19px] top-0 h-full w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            style={{ scaleY: reduced ? 1 : lineScale }}
            className="absolute left-[19px] top-0 h-full w-px origin-top bg-gradient-to-b from-royal-gold via-royal-red to-royal-gold md:left-1/2 md:-translate-x-1/2"
          />
          {!reduced && (
            <motion.div
              aria-hidden="true"
              style={{ top: glowY }}
              className="absolute left-[19px] z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal-red/50 blur-2xl md:left-1/2"
            />
          )}

          <ul className="space-y-12 sm:space-y-20">
            {timeline.map((item, i) => {
              const left = i % 2 === 0;
              return (
                <li
                  key={item.step}
                  className={`relative flex flex-col gap-5 pl-14 md:flex-row md:items-center md:gap-10 md:pl-0 ${
                    left ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Le point sur la ligne */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                    className="absolute left-[19px] top-2 z-20 -translate-x-1/2 md:left-1/2 md:top-1/2 md:-translate-y-1/2"
                  >
                    <span className="relative flex h-6 w-6 items-center justify-center">
                      <span className="absolute inset-0 animate-pulse-glow rounded-full bg-royal-red/60 blur-md" />
                      <span className="relative flex h-4 w-4 items-center justify-center rounded-full border border-royal-gold bg-black text-[9px]">
                        {item.emoji}
                      </span>
                    </span>
                  </motion.div>

                  {/* La carte */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: reduced ? 0 : left ? -60 : 60,
                      y: 30,
                      rotate: reduced ? 0 : left ? -2 : 2,
                    }}
                    whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    whileHover={reduced ? {} : { y: -6, scale: 1.015 }}
                    className={`royal-card group relative w-full p-5 sm:p-6 md:w-[calc(50%-2.5rem)] ${
                      left ? 'md:text-right' : 'md:text-left'
                    }`}
                  >
                    <div className="pointer-events-none absolute -inset-px rounded-[1.25rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ boxShadow: '0 0 45px rgba(220,38,38,0.45)' }} />

                    <div
                      className={`flex items-center gap-3 ${left ? 'md:flex-row-reverse' : ''}`}
                    >
                      <span className="rounded-full border border-royal-gold/40 bg-royal-red/15 px-3 py-1 font-display text-xs font-bold tracking-widest text-royal-gold">
                        {item.step}
                      </span>
                      {item.date && (
                        <span className="text-[11px] tracking-[0.2em] text-white/35">
                          {item.date.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-display text-xl text-white sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
                  </motion.div>

                  {/* La photo */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, rotate: reduced ? 0 : left ? 4 : -4 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: left ? 2 : -2 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
                    whileHover={reduced ? {} : { rotate: 0, scale: 1.05 }}
                    className="w-full md:w-[calc(50%-2.5rem)]"
                  >
                    <div className="royal-frame mx-auto w-full max-w-[220px] md:max-w-[240px]">
                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.35rem] bg-royal-coal">
                        <RoyalPhoto
                          src={item.photo ?? '/images/peace-01.jpg'}
                          alt={`${item.step} — ${item.title}`}
                          sizes="(max-width: 768px) 60vw, 240px"
                          showHint={false}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    </div>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
