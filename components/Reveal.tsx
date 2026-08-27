'use client';

import { motion, useReducedMotion, type Transition } from 'framer-motion';
import type { ReactNode } from 'react';
import { variantsMap, type VariantName, EASE } from '@/lib/motion';

type RevealProps = {
  children: ReactNode;
  /** Type d'apparition : fadeUp, blurIn, scaleIn, tiltIn, slideLeft... */
  variant?: VariantName;
  delay?: number;
  duration?: number;
  className?: string;
  /** Part de l'élément visible avant de déclencher l'animation */
  amount?: number;
  once?: boolean;
  as?: 'div' | 'section' | 'li' | 'span' | 'p' | 'h2' | 'h3';
};

/**
 * Enveloppe n'importe quel contenu pour le faire apparaître au scroll.
 * Si l'utilisateur a demandé moins d'animations, le contenu s'affiche simplement.
 */
export default function Reveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.9,
  className,
  amount = 0.25,
  once = true,
  as = 'div',
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as] as typeof motion.div;

  const transition: Transition =
    variant === 'popIn'
      ? { type: 'spring', stiffness: 190, damping: 14, delay }
      : { duration, ease: EASE, delay };

  return (
    <MotionTag
      className={className}
      variants={variantsMap[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={transition}
    >
      {children}
    </MotionTag>
  );
}
