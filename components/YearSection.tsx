'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useRef } from 'react';
import Reveal from '@/components/Reveal';
import Sparkles from '@/components/Sparkles';
import { yearStory } from '@/config/birthday';
import { EASE } from '@/lib/motion';

/** Section « Une année déjà... » : le grand 1, puis les phrases une par une. */
export default function YearSection() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const digitRotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  return (
    <section id="histoire" ref={ref} className="section-pad relative overflow-hidden px-5">
      {/* Fond en parallaxe */}
      <motion.div
        aria-hidden="true"
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-x-0 -inset-y-24 bg-[radial-gradient(ellipse_at_50%_35%,rgba(127,29,29,0.35)_0%,transparent_62%)]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal variant="blurIn">
          <p className="mb-3 text-[11px] font-semibold tracking-[0.4em] text-royal-gold">
            CHAPITRE PREMIER
          </p>
        </Reveal>

        <Reveal variant="fadeUp" delay={0.08}>
          <h2 className="text-gold-gradient font-display text-4xl font-bold tracking-tight sm:text-6xl">
            {yearStory.title}
          </h2>
        </Reveal>

        {/* Le grand 1 */}
        <div className="relative mx-auto my-12 flex h-44 w-44 items-center justify-center sm:h-56 sm:w-56">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-royal-red/30 blur-[55px]"
            animate={reduced ? {} : { scale: [1, 1.18, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-2 rounded-full border border-royal-gold/25"
            animate={reduced ? {} : { rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{ borderStyle: 'dashed' }}
          />
          <motion.span
            style={{ rotate: digitRotate }}
            initial={{ opacity: 0, scale: 0.3, filter: 'blur(24px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-gold-gradient font-display text-[8rem] font-black leading-none glow-red sm:text-[11rem]"
          >
            1
          </motion.span>
          <Sparkles count={8} className="-m-6" />
        </div>

        <Reveal variant="fadeUp">
          <p className="font-display text-xl text-white/90 sm:text-2xl">{yearStory.intro}</p>
        </Reveal>

        <div className="mx-auto mt-10 max-w-2xl space-y-5 sm:mt-14">
          {yearStory.lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: EASE, delay: reduced ? 0 : i * 0.12 }}
              className="text-base leading-relaxed text-white/70 sm:text-lg"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <Reveal variant="scaleIn" delay={0.15}>
          <div className="mt-14 inline-flex items-center gap-3 rounded-full border border-royal-gold/30 bg-black/40 px-6 py-3 backdrop-blur-sm">
            <Heart className="h-4 w-4 animate-heartbeat fill-royal-red text-royal-red" />
            <span className="font-display text-sm text-white/85 sm:text-base">
              {yearStory.outro}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
