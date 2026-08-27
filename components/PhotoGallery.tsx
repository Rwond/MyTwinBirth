'use client';

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ChevronLeft, ChevronRight, Crown, Maximize2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import RoyalPhoto from '@/components/RoyalPhoto';
import Reveal from '@/components/Reveal';
import Sparkles from '@/components/Sparkles';
import type { Photo } from '@/config/birthday';
import { fireConfetti } from '@/lib/confetti';
import { EASE } from '@/lib/motion';

/* Chaque photo reçoit sa propre inclinaison et son propre format :
   on obtient un album royal, et non une grille toute plate. */
const TILTS = [-3, 2.5, -1.5, 3, -2, 1.8, -2.8, 2.2];
/* Toutes les photos sont en portrait : on garde des formats portrait, avec des
   hauteurs variées pour l'effet album (aucun visage coupé par un cadrage carré). */
const RATIOS = [
  'aspect-[3/4]',
  'aspect-[4/5]',
  'aspect-[2/3]',
  'aspect-[3/4]',
  'aspect-[4/5]',
  'aspect-[5/7]',
];

function GalleryItem({
  photo,
  index,
  onOpen,
}: {
  photo: Photo;
  index: number;
  onOpen: (i: number) => void;
}) {
  const reduced = useReducedMotion();
  const tilt = TILTS[index % TILTS.length];
  const ratio = RATIOS[index % RATIOS.length];

  // Effet 3D au survol
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className="mb-4 break-inside-avoid sm:mb-6"
      initial={{ opacity: 0, y: 70, scale: 0.9, rotate: reduced ? 0 : tilt * 2.5, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: reduced ? 0 : tilt, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: EASE, delay: (index % 3) * 0.08 }}
      style={{ perspective: 900 }}
    >
      <motion.button
        onClick={() => onOpen(index)}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={reduced ? {} : { scale: 1.045, rotate: 0 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="group relative block w-full text-left"
        aria-label={photo.caption ? `Agrandir : ${photo.caption}` : 'Agrandir la photo'}
      >
        <div className="royal-frame overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_0_70px_rgba(220,38,38,0.6)]">
          <div className={`relative w-full overflow-hidden rounded-[1.35rem] bg-royal-coal ${ratio}`}>
            <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-110">
              <RoyalPhoto
                src={photo.src}
                alt={photo.caption ?? 'Photo de HM Peace'}
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              />
            </div>

            {/* Voile + légende */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

            {/* Reflet lumineux au survol */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.3)_50%,transparent_65%)] transition-transform duration-1000 group-hover:translate-x-full" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
              {photo.caption && (
                <span className="font-display text-sm text-white/90 drop-shadow-lg sm:text-base">
                  {photo.caption}
                </span>
              )}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-royal-gold/50 bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
                <Maximize2 className="h-3.5 w-3.5 text-royal-gold" />
              </span>
            </div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const reduced = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const total = photos.length;

  const open = useCallback((i: number) => {
    setOpenIndex(i);
    fireConfetti({ x: 0.5, y: 0.5, count: 26, power: 9, spread: 360 });
  }, []);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(() => setOpenIndex((i) => (i === null ? i : (i + 1) % total)), [total]);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + total) % total)),
    [total]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIndex, close, next, prev]);

  const half = Math.ceil(total / 2);
  const firstHalf = photos.slice(0, half);
  const secondHalf = photos.slice(half);

  return (
    <section id="galerie" className="section-pad relative overflow-hidden px-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(220,38,38,0.16),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <Reveal variant="fadeUp">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.4em] text-royal-gold">
              ALBUM ROYAL
            </p>
          </Reveal>
          <Reveal variant="blurIn" delay={0.08}>
            <h2 className="text-gold-gradient font-display text-4xl font-bold tracking-tight sm:text-6xl">
              📸 Les souvenirs du Prince
            </h2>
          </Reveal>
          <Reveal variant="fadeIn" delay={0.2}>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/50 sm:text-base">
              {total} souvenirs, du tout premier jour jusqu&apos;à son premier anniversaire.
              Touche une photo pour l&apos;ouvrir en grand.
            </p>
          </Reveal>
        </div>

        {/* Première moitié de l'album */}
        <div className="columns-2 gap-4 sm:gap-6 lg:columns-3">
          {firstHalf.map((photo, i) => (
            <GalleryItem key={photo.src + i} photo={photo} index={i} onOpen={open} />
          ))}
        </div>

        {/* Le sceau royal au milieu de l'album */}
        <Reveal variant="scaleIn" className="relative my-10 flex justify-center sm:my-16">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-royal-gold/30"
              animate={reduced ? {} : { rotate: 360 }}
              transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
              style={{ borderStyle: 'dashed' }}
            />
            <div className="absolute inset-0 rounded-full bg-royal-red/25 blur-2xl" />
            <motion.div
              animate={reduced ? {} : { y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Crown className="h-11 w-11 text-royal-gold drop-shadow-[0_0_22px_rgba(245,158,11,0.9)]" />
            </motion.div>
            <Sparkles count={6} className="-m-6" />
          </div>
        </Reveal>

        {/* Seconde moitié */}
        <div className="columns-2 gap-4 sm:gap-6 lg:columns-3">
          {secondHalf.map((photo, i) => (
            <GalleryItem
              key={photo.src + (i + half)}
              photo={photo}
              index={i + half}
              onOpen={open}
            />
          ))}
        </div>

        <Reveal variant="fadeIn">
          <p className="mt-12 text-center text-xs text-white/25">
            {total} souvenirs du Prince 👑
          </p>
        </Reveal>
      </div>

      {/* --- Lightbox plein écran --- */}
      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[75] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Lumière derrière la photo */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal-red/30 blur-[90px]"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
            />

            <button
              onClick={close}
              aria-label="Fermer"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-royal-gold/40 bg-black/60 text-royal-gold backdrop-blur-md transition-colors hover:bg-royal-red/30 sm:right-8 sm:top-8"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={prev}
              aria-label="Photo précédente"
              className="absolute left-2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition-all hover:border-royal-gold/60 hover:text-royal-gold sm:left-6 sm:h-14 sm:w-14"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={next}
              aria-label="Photo suivante"
              className="absolute right-2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition-all hover:border-royal-gold/60 hover:text-royal-gold sm:right-6 sm:h-14 sm:w-14"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={openIndex}
                className="relative z-10 w-[86vw] max-w-2xl"
                initial={{ opacity: 0, scale: 0.85, y: 30, filter: 'blur(14px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.92, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: EASE }}
                drag={reduced ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) next();
                  if (info.offset.x > 70) prev();
                }}
              >
                <div className="royal-frame">
                  <div className="relative h-[58svh] w-full overflow-hidden rounded-[1.35rem] bg-black sm:h-[64svh]">
                    <RoyalPhoto
                      src={photos[openIndex].src}
                      alt={photos[openIndex].caption ?? 'Photo de HM Peace'}
                      sizes="86vw"
                      fit="contain"
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="font-display text-sm text-white/85 sm:text-lg">
                    {photos[openIndex].caption ?? ''}
                  </p>
                  <span className="shrink-0 rounded-full border border-royal-gold/30 px-3 py-1 text-xs tracking-widest text-royal-gold">
                    {openIndex + 1} / {total}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
