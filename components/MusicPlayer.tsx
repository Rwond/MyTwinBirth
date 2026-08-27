'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { music } from '@/config/birthday';
import { registerMusicControls } from '@/lib/audioBus';

/**
 * Petit lecteur flottant. La musique ne démarre JAMAIS toute seule :
 * elle attend un clic (c'est aussi ce qu'exigent les navigateurs).
 * Dépose ton fichier dans public/audio/ et indique-le dans config/birthday.ts.
 */
export default function MusicPlayer({ visible = true }: { visible?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(music.defaultVolume);
  const [missing, setMissing] = useState(false);

  const volumeRef = useRef(music.defaultVolume);

  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  /* Le film (et n'importe quel autre composant) peut lancer la musique. */
  useEffect(() => {
    registerMusicControls({
      play: () => {
        const audio = audioRef.current;
        if (!audio || !audio.paused) return;
        audio.volume = volumeRef.current;
        audio.play().catch(() => setMissing(true));
      },
      pause: () => audioRef.current?.pause(),
      isPlaying: () => Boolean(audioRef.current && !audioRef.current.paused),
    });
    return () => registerMusicControls(null);
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || missing) {
      setExpanded((v) => !v);
      return;
    }
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        audio.volume = volume;
        await audio.play();
        setPlaying(true);
        setExpanded(true);
      } catch {
        setMissing(true);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, delay: visible ? 0.8 : 0 }}
      className="fixed bottom-5 right-4 z-[65] flex items-center gap-2 sm:bottom-7 sm:right-6"
    >
      <audio
        ref={audioRef}
        src={music.src}
        loop
        preload="none"
        onError={() => setMissing(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Panneau volume */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, x: 24, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: 24, width: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 overflow-hidden rounded-full border border-royal-gold/25 bg-black/70 px-4 py-2.5 backdrop-blur-xl"
          >
            {missing ? (
              <span className="whitespace-nowrap text-[10px] leading-tight text-white/50">
                Ajoute <span className="text-royal-gold/80">{music.src}</span>
              </span>
            ) : (
              <>
                <button
                  onClick={() => setVolume((v) => (v === 0 ? music.defaultVolume : 0))}
                  aria-label={volume === 0 ? 'Activer le son' : 'Couper le son'}
                  className="text-white/70 transition-colors hover:text-royal-gold"
                >
                  {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  aria-label="Volume"
                  className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/15 accent-royal-red sm:w-24"
                  style={{
                    background: `linear-gradient(to right, #DC2626 ${volume * 100}%, rgba(255,255,255,0.15) ${volume * 100}%)`,
                  }}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton principal */}
      <button
        onClick={toggle}
        onDoubleClick={() => setExpanded((v) => !v)}
        aria-label={playing ? 'Mettre la musique en pause' : 'Lancer la musique'}
        className="relative flex items-center justify-center rounded-full border border-royal-gold/40 bg-gradient-to-br from-royal-red via-royal-dark to-black shadow-[0_0_28px_rgba(220,38,38,0.55)] transition-transform duration-300 hover:scale-110"
        style={{ height: 52, width: 52 }}
      >
        {playing && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full border border-royal-gold/50"
              animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.span
              className="absolute inset-0 rounded-full border border-royal-red/60"
              animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.6, ease: 'easeOut' }}
            />
          </>
        )}

        <motion.span
          animate={playing ? { rotate: 360 } : { rotate: 0 }}
          transition={
            playing ? { duration: 6, repeat: Infinity, ease: 'linear' } : { duration: 0.4 }
          }
          className="relative text-white"
        >
          {missing ? (
            <Music className="h-5 w-5 opacity-50" />
          ) : playing ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="ml-0.5 h-5 w-5" />
          )}
        </motion.span>
      </button>
    </motion.div>
  );
}
