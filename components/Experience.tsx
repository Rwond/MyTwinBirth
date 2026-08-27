'use client';

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import BirthdayHero from '@/components/BirthdayHero';
import BirthdayMessage from '@/components/BirthdayMessage';
import Confetti from '@/components/Confetti';
import Countdown from '@/components/Countdown';
import CustomCursor from '@/components/CustomCursor';
import FinalCelebration from '@/components/FinalCelebration';
import IntroScreen from '@/components/IntroScreen';
import MusicPlayer from '@/components/MusicPlayer';
import Navigation from '@/components/Navigation';
import Particles from '@/components/Particles';
import PhotoFilm from '@/components/PhotoFilm';
import PhotoGallery from '@/components/PhotoGallery';
import RoyalSection from '@/components/RoyalSection';
import ScrollProgress from '@/components/ScrollProgress';
import Timeline from '@/components/Timeline';
import YearSection from '@/components/YearSection';
import type { Photo } from '@/config/birthday';

/** Petit ornement doré entre deux sections. */
function Divider() {
  return (
    <div className="relative mx-auto flex max-w-xs items-center gap-4 px-8 py-2">
      <span className="gold-divider flex-1" />
      <motion.span
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="text-sm text-royal-gold/70"
      >
        ✦
      </motion.span>
      <span className="gold-divider flex-1" />
    </div>
  );
}

export default function Experience({ photos }: { photos: Photo[] }) {
  const [introDone, setIntroDone] = useState(false);
  const { scrollYProgress } = useScroll();

  // Le fond change très légèrement de teinte au fil du voyage
  const bgOpacityRed = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.35, 0.15, 0.3, 0.55]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  // Pendant l'ouverture, on bloque le scroll et on remonte en haut
  useEffect(() => {
    if (introDone) {
      document.body.style.overflow = '';
      return;
    }
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [introDone]);

  return (
    <>
      <CustomCursor />
      <Confetti />

      {/* Fond global : particules + halos qui évoluent avec le scroll */}
      <div className="fixed inset-0 -z-10 bg-royal-black">
        <motion.div
          aria-hidden="true"
          style={{ opacity: bgOpacityRed, y: bgY }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(127,29,29,0.55),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(220,38,38,0.35),transparent_55%)]"
        />
        <div className="absolute inset-0">
          <Particles density={0.85} opacity={0.9} />
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] noise" />
      </div>

      <AnimatePresence>
        {!introDone && <IntroScreen key="intro" onFinish={() => setIntroDone(true)} />}
      </AnimatePresence>

      <ScrollProgress />
      <Navigation visible={introDone} />
      <MusicPlayer visible={introDone} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!introDone}
        className="relative"
      >
        <BirthdayHero />
        <Divider />
        <YearSection />
        <Divider />
        <Timeline />
        <Divider />
        <PhotoGallery photos={photos} />
        <Divider />
        <Countdown />
        <Divider />
        <BirthdayMessage />
        <RoyalSection />
        <PhotoFilm photos={photos} />
        <FinalCelebration />
      </motion.main>
    </>
  );
}
