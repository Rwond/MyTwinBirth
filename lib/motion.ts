import type { Variants } from 'framer-motion';

/** Courbe d'animation « douce et royale » utilisée partout. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE } },
};

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(14px)', y: 26, scale: 0.97 },
  show: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: EASE },
  },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -70, rotate: -2 },
  show: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.9, ease: EASE } },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 70, rotate: 2 },
  show: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.9, ease: EASE } },
};

export const tiltIn: Variants = {
  hidden: { opacity: 0, y: 60, rotate: -6, scale: 0.9 },
  show: { opacity: 1, y: 0, rotate: 0, scale: 1, transition: { duration: 0.95, ease: EASE } },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 190, damping: 14 },
  },
};

export const variantsMap = {
  fadeUp,
  fadeDown,
  fadeIn,
  scaleIn,
  blurIn,
  slideLeft,
  slideRight,
  tiltIn,
  popIn,
} as const;

export type VariantName = keyof typeof variantsMap;

/** Conteneur qui fait apparaître ses enfants les uns après les autres. */
export const stagger = (staggerChildren = 0.14, delayChildren = 0.1): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});
