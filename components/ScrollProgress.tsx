'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Fine barre dorée qui se remplit pendant le voyage à travers l'année. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[66] h-[2px] origin-left bg-gradient-to-r from-royal-red via-royal-gold to-royal-red shadow-[0_0_12px_rgba(245,158,11,0.7)]"
    />
  );
}
