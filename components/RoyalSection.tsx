'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Reveal from '@/components/Reveal';
import Sparkles from '@/components/Sparkles';
import { birthdayConfig } from '@/config/birthday';

const RING_1 = ['⭐', '❤️', '✨', '👑', '⭐', '❤️'];
const RING_2 = ['✨', '👑', '💫', '❤️', '⭐', '✨', '💛', '👑'];

/** Un anneau d'emojis qui tourne lentement autour de la couronne. */
function Orbit({
  items,
  radius,
  duration,
  reverse = false,
  size = 'text-xl',
  reduced,
}: {
  items: string[];
  radius: number;
  duration: number;
  reverse?: boolean;
  size?: string;
  reduced: boolean | null;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0"
      animate={reduced ? {} : { rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      {items.map((emoji, i) => {
        const angle = (i / items.length) * 360;
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `rotate(${angle}deg) translateY(-${radius}px)`,
            }}
          >
            <motion.span
              className={`block ${size} drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]`}
              animate={reduced ? {} : { rotate: reverse ? 360 : -360, scale: [1, 1.18, 1] }}
              transition={{
                rotate: { duration, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              {emoji}
            </motion.span>
          </div>
        );
      })}
    </motion.div>
  );
}

/** La grande section royale : couronne, halo rouge, étoiles et cœurs en orbite. */
export default function RoyalSection() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['14%', '-14%']);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.15, 0.8]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-royal-black px-5 py-24"
    >
      <div className="pointer-events-none absolute inset-0 vignette" />

      <motion.div style={{ y }} className="relative z-10 flex flex-col items-center text-center">
        {/* Halo rouge derrière la couronne */}
        <motion.div
          aria-hidden="true"
          style={{ scale: glowScale }}
          className="pointer-events-none absolute left-1/2 top-[26%] h-[65vmin] w-[65vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.5)_0%,rgba(127,29,29,0.25)_40%,transparent_70%)] blur-[40px]"
        />

        {/* La couronne et ses orbites */}
        <div className="relative flex h-[300px] w-[300px] items-center justify-center sm:h-[420px] sm:w-[420px]">
          <Orbit items={RING_1} radius={110} duration={38} reduced={reduced} />
          <Orbit
            items={RING_2}
            radius={150}
            duration={54}
            reverse
            size="text-base sm:text-lg"
            reduced={reduced}
          />

          <motion.div
            initial={{ scale: 0.4, opacity: 0, filter: 'blur(20px)' }}
            whileInView={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <motion.span
              className="block text-[5.5rem] leading-none drop-shadow-[0_0_35px_rgba(245,158,11,0.85)] sm:text-[8rem]"
              animate={reduced ? {} : { y: [0, -12, 0], rotate: [-4, 4, -4] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              👑
            </motion.span>
          </motion.div>

          <Sparkles count={12} />
        </div>

        <Reveal variant="blurIn" delay={0.15}>
          <h2 className="text-gold-gradient mt-6 font-display text-3xl font-black tracking-[0.18em] sm:text-6xl">
            {birthdayConfig.nickname.toUpperCase()}
          </h2>
        </Reveal>

        <Reveal variant="fadeUp" delay={0.3}>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
            Un prénom porté comme une promesse. Une prière exaucée, devenue le plus beau des
            cadeaux. 🙏
          </p>
        </Reveal>

        <Reveal variant="fadeIn" delay={0.45}>
          <div className="mt-8 flex items-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-royal-gold/60" />
            <span className="text-[11px] tracking-[0.4em] text-royal-gold/80">
              {birthdayConfig.name}
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-royal-gold/60" />
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}
