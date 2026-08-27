'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Crown, Heart } from 'lucide-react';
import Reveal from '@/components/Reveal';
import Sparkles from '@/components/Sparkles';
import { letter } from '@/config/birthday';
import { EASE } from '@/lib/motion';

/** Une ligne qui s'écrit mot après mot, comme une lettre. */
function WrittenLine({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  if (reduced) return <p className={className}>{text}</p>;

  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.045, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE } },
          }}
        >
          {word}
          {' '}
        </motion.span>
      ))}
    </motion.p>
  );
}

export default function BirthdayMessage() {
  const reduced = useReducedMotion();

  return (
    <section id="message" className="section-pad relative overflow-hidden px-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(220,38,38,0.18),transparent_62%)]" />

      <div className="relative mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <Reveal variant="scaleIn">
            <Heart className="mx-auto mb-4 h-8 w-8 animate-heartbeat fill-royal-red text-royal-red drop-shadow-[0_0_18px_rgba(220,38,38,0.9)]" />
          </Reveal>
          <Reveal variant="fadeUp" delay={0.08}>
            <h2 className="text-gold-gradient font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {letter.title}
            </h2>
          </Reveal>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: reduced ? 0 : 8, filter: 'blur(14px)' }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ perspective: 1200 }}
          className="relative"
        >
          {/* Halo derrière la lettre */}
          <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-royal-red/15 blur-[50px]" />

          <div className="royal-frame relative">
            <div className="relative overflow-hidden rounded-[1.35rem] bg-[linear-gradient(160deg,#0d0d0d,#050505_60%,#140404)] px-6 py-10 sm:px-12 sm:py-14">
              <div className="pointer-events-none absolute inset-0 opacity-[0.05] noise" />

              {/* Sceau royal */}
              <motion.div
                initial={{ scale: 0, rotate: -40 }}
                whileInView={{ scale: 1, rotate: -12 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.4 }}
                className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-full border border-royal-gold/50 bg-gradient-to-br from-royal-red to-royal-dark shadow-[0_0_25px_rgba(220,38,38,0.6)] sm:right-8 sm:top-8"
              >
                <Crown className="h-6 w-6 text-royal-gold" />
              </motion.div>

              <div className="relative space-y-6">
                {letter.paragraphs.map((p, i) => (
                  <WrittenLine
                    key={i}
                    text={p}
                    delay={0.1}
                    className={
                      i === 0
                        ? 'font-display text-xl text-royal-gold sm:text-2xl'
                        : i === letter.paragraphs.length - 1
                          ? 'pt-2 font-display text-lg text-white sm:text-2xl glow-red'
                          : 'text-base leading-relaxed text-white/75 sm:text-lg'
                    }
                  />
                ))}
              </div>

              <Reveal variant="fadeIn" delay={0.3}>
                <div className="mt-10">
                  <div className="gold-divider mb-5 w-full" />
                  <p className="text-right font-display text-sm italic text-white/50 sm:text-base">
                    {letter.signature}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          <Sparkles count={8} className="-m-4" />
        </motion.div>
      </div>
    </section>
  );
}
