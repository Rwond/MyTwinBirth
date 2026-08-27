'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Crown,
  Pause,
  Play,
  RotateCcw,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import Reveal from '@/components/Reveal';
import Sparkles from '@/components/Sparkles';
import { birthdayConfig, type Photo } from '@/config/birthday';
import { playMusic } from '@/lib/audioBus';
import { celebrationBlast, fireConfetti } from '@/lib/confetti';
import { EASE } from '@/lib/motion';

/** Durée d'affichage d'une photo (ms) */
const SLIDE_MS = 4200;

/** Mouvements « Ken Burns » : chaque photo bouge un peu différemment. */
const MOVES = [
  { from: { scale: 1.06, x: '-1.5%', y: '1.5%' }, to: { scale: 1.18, x: '1.5%', y: '-1.5%' } },
  { from: { scale: 1.2, x: '1%', y: '-1%' }, to: { scale: 1.04, x: '-1%', y: '1%' } },
  { from: { scale: 1.05, x: '0%', y: '2%' }, to: { scale: 1.2, x: '0%', y: '-2%' } },
  { from: { scale: 1.16, x: '-2%', y: '0%' }, to: { scale: 1.04, x: '2%', y: '0%' } },
];

/**
 * 🎬 Le film du Prince : toutes ses photos enchaînées en plein écran,
 * avec zoom lent, fondus, légendes et bouquet final.
 */
export default function PhotoFilm({ photos }: { photos: Photo[] }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [finished, setFinished] = useState(false);
  const timer = useRef<number | null>(null);

  const total = photos.length;
  const durationMin = Math.max(1, Math.round((total * SLIDE_MS) / 60000));

  const clearTimer = () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const finish = useCallback(() => {
    clearTimer();
    setFinished(true);
    setPlaying(false);
    celebrationBlast();
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (next >= total) {
        finish();
        return;
      }
      setFinished(false);
      setIndex((next + total) % total);
    },
    [total, finish]
  );

  const start = useCallback(() => {
    setIndex(0);
    setFinished(false);
    setPlaying(true);
    setOpen(true);
    playMusic();
    fireConfetti({ x: 0.5, y: 0.6, count: 40, power: 11 });
  }, []);

  const close = useCallback(() => {
    clearTimer();
    setOpen(false);
    setPlaying(false);
  }, []);

  const replay = useCallback(() => {
    setIndex(0);
    setFinished(false);
    setPlaying(true);
  }, []);

  /* Défilement automatique */
  useEffect(() => {
    if (!open || !playing || finished) return;
    clearTimer();
    timer.current = window.setTimeout(() => {
      if (index + 1 >= total) finish();
      else setIndex((i) => i + 1);
    }, reduced ? SLIDE_MS * 1.4 : SLIDE_MS);
    return clearTimer;
  }, [open, playing, finished, index, total, finish, reduced]);

  /* Clavier + blocage du scroll pendant le film */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') goTo(index + 1);
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, index, close, goTo]);

  /* On met en pause si l'onglet passe en arrière-plan */
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const current = photos[index];
  const move = MOVES[index % MOVES.length];
  const nextPhoto = photos[(index + 1) % total];

  return (
    <section id="film" className="section-pad relative overflow-hidden px-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(127,29,29,0.3),transparent_65%)]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal variant="fadeUp">
          <p className="mb-3 text-[11px] font-semibold tracking-[0.4em] text-royal-gold">
            SÉANCE PRIVÉE
          </p>
        </Reveal>

        <Reveal variant="blurIn" delay={0.08}>
          <h2 className="text-gold-gradient font-display text-4xl font-bold tracking-tight sm:text-6xl">
            🎬 Le film du Prince
          </h2>
        </Reveal>

        <Reveal variant="fadeIn" delay={0.18}>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/55 sm:text-base">
            Toute sa première année en {total} photos, enchaînées comme un film.
            Installe-toi confortablement. 🍿
          </p>
        </Reveal>

        {/* L'affiche du film */}
        <Reveal variant="scaleIn" delay={0.25}>
          <div className="relative mx-auto mt-12 w-full max-w-md">
            {/* Photos empilées derrière l'affiche */}
            {photos.slice(0, 3).map((photo, i) => (
              <motion.div
                key={photo.src}
                aria-hidden="true"
                className="absolute inset-0 origin-bottom overflow-hidden rounded-[1.5rem] border border-royal-gold/30"
                style={{ zIndex: -i }}
                animate={
                  reduced
                    ? {}
                    : {
                        rotate: [(i + 1) * -3, (i + 1) * 3, (i + 1) * -3],
                        y: (i + 1) * 10,
                        scale: 1 - (i + 1) * 0.03,
                      }
                }
                transition={{ duration: 9 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 90vw, 420px"
                  className="object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-black/60" />
              </motion.div>
            ))}

            <button
              onClick={start}
              className="royal-frame group relative block w-full"
              aria-label="Lancer le film"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.35rem] bg-royal-coal sm:aspect-[4/3]">
                <Image
                  src={birthdayConfig.heroPhoto}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 90vw, 420px"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <motion.span
                    className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-royal-gold bg-black/60 backdrop-blur-sm"
                    animate={reduced ? {} : { scale: [1, 1.07, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <span className="absolute inset-0 rounded-full bg-royal-red/40 blur-xl" />
                    <Play className="relative ml-1 h-8 w-8 fill-royal-gold text-royal-gold" />
                  </motion.span>
                  <span className="font-display text-lg tracking-[0.2em] text-white sm:text-xl">
                    LANCER LE FILM
                  </span>
                  <span className="text-[11px] tracking-[0.25em] text-royal-gold/80">
                    {total} PHOTOS · ~{durationMin} MIN
                  </span>
                </div>

                <Clapperboard className="absolute left-4 top-4 h-5 w-5 text-royal-gold/70" />
                <Crown className="absolute right-4 top-4 h-5 w-5 text-royal-gold/70" />
              </div>
            </button>

            <Sparkles count={8} className="-m-6" />
          </div>
        </Reveal>
      </div>

      {/* ------------------------------ LE FILM ------------------------------ */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[78] bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Fond flou de la photo en cours */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`bg-${index}`}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <Image
                  src={current.src}
                  alt=""
                  fill
                  sizes="100vw"
                  className="scale-125 object-cover blur-2xl"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/90" />

            {/* La photo, avec son mouvement lent */}
            <div className="absolute inset-0 flex items-center justify-center p-4 pb-24 pt-16 sm:p-10 sm:pb-28">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`slide-${index}`}
                  className="relative h-full w-full"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <motion.div
                    className="relative h-full w-full"
                    initial={reduced ? {} : move.from}
                    animate={reduced ? {} : move.to}
                    transition={{ duration: (SLIDE_MS / 1000) * 1.4, ease: 'linear' }}
                  >
                    <Image
                      src={current.src}
                      alt={current.caption ?? `Photo de ${birthdayConfig.name}`}
                      fill
                      sizes="100vw"
                      priority
                      className="object-contain drop-shadow-[0_0_50px_rgba(220,38,38,0.35)]"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Préchargement discret de la photo suivante */}
              <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
                <Image src={nextPhoto.src} alt="" width={16} height={16} />
              </div>
            </div>

            {/* Coins dorés facon pellicule */}
            {[
              'left-3 top-3 border-l-2 border-t-2 rounded-tl-xl',
              'right-3 top-3 border-r-2 border-t-2 rounded-tr-xl',
              'left-3 bottom-3 border-b-2 border-l-2 rounded-bl-xl',
              'right-3 bottom-3 border-b-2 border-r-2 rounded-br-xl',
            ].map((cls) => (
              <span
                key={cls}
                aria-hidden="true"
                className={`pointer-events-none absolute h-10 w-10 border-royal-gold/50 ${cls}`}
              />
            ))}

            {/* Barre de progression par photo (comme des « stories ») */}
            <div className="absolute inset-x-0 top-0 flex gap-1 p-3">
              {photos.map((photo, i) => (
                <div
                  key={photo.src}
                  className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15"
                >
                  {i < index || finished ? (
                    <div className="h-full w-full bg-gradient-to-r from-royal-gold to-royal-red" />
                  ) : i === index ? (
                    <div
                      key={`bar-${index}`}
                      className="h-full bg-gradient-to-r from-royal-gold to-royal-red"
                      style={{
                        animation: `filmProgress ${SLIDE_MS}ms linear forwards`,
                        animationPlayState: playing ? 'running' : 'paused',
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>

            {/* Légende */}
            <AnimatePresence mode="wait">
              {current.caption && !finished && (
                <motion.div
                  key={`cap-${index}`}
                  className="absolute inset-x-0 bottom-20 text-center sm:bottom-24"
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <p className="mx-auto max-w-xl px-6 font-display text-lg text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] sm:text-2xl">
                    {current.caption}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Zones de navigation (moitié gauche / moitié droite) */}
            <button
              className="absolute inset-y-16 left-0 w-1/3"
              onClick={() => goTo(index - 1)}
              aria-label="Photo précédente"
            />
            <button
              className="absolute inset-y-16 right-0 w-1/3"
              onClick={() => goTo(index + 1)}
              aria-label="Photo suivante"
            />

            {/* Commandes */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 p-5">
              <button
                onClick={() => goTo(index - 1)}
                aria-label="Photo précédente"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition-colors hover:border-royal-gold/60 hover:text-royal-gold"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={() => (finished ? replay() : setPlaying((p) => !p))}
                aria-label={finished ? 'Revoir le film' : playing ? 'Pause' : 'Reprendre'}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-royal-gold/60 bg-gradient-to-br from-royal-red to-royal-dark text-white shadow-[0_0_30px_rgba(220,38,38,0.6)]"
              >
                {finished ? (
                  <RotateCcw className="h-6 w-6" />
                ) : playing ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="ml-0.5 h-6 w-6" />
                )}
              </button>

              <button
                onClick={() => goTo(index + 1)}
                aria-label="Photo suivante"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition-colors hover:border-royal-gold/60 hover:text-royal-gold"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <span className="ml-2 rounded-full border border-royal-gold/30 px-3 py-1 text-xs tracking-widest text-royal-gold">
                {Math.min(index + 1, total)} / {total}
              </span>
            </div>

            <button
              onClick={close}
              aria-label="Fermer le film"
              className="absolute right-4 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-royal-gold/40 bg-black/60 text-royal-gold backdrop-blur-md transition-colors hover:bg-royal-red/30"
            >
              <X className="h-5 w-5" />
            </button>

            {/* --- Le générique de fin --- */}
            <AnimatePresence>
              {finished && (
                <motion.div
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/85 px-6 text-center backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.span
                    className="text-6xl"
                    initial={{ scale: 0, rotate: -40 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 12 }}
                  >
                    👑
                  </motion.span>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
                    className="text-gold-gradient mt-6 font-display text-3xl font-black tracking-[0.12em] sm:text-5xl"
                  >
                    JOYEUX ANNIVERSAIRE
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 150, damping: 14 }}
                    className="text-red-gradient glow-red mt-2 font-display text-4xl font-black sm:text-6xl"
                  >
                    {birthdayConfig.name} ❤️
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mt-4 font-display text-xs tracking-[0.3em] text-white/70 sm:text-sm"
                  >
                    {birthdayConfig.nickname.toUpperCase()} · {total} SOUVENIRS
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.7 }}
                    className="mt-10 flex flex-wrap items-center justify-center gap-3"
                  >
                    <button onClick={replay} className="btn-royal text-sm">
                      <RotateCcw className="h-4 w-4" />
                      Revoir le film
                    </button>
                    <button
                      onClick={close}
                      className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/70 transition-colors hover:border-royal-gold/60 hover:text-royal-gold"
                    >
                      Retour au site
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
