'use client';

import Image from 'next/image';
import { Crown, ImagePlus } from 'lucide-react';
import { useState } from 'react';

type RoyalPhotoProps = {
  src: string;
  alt: string;
  /** Chargée en priorité (photo du hero uniquement) */
  priority?: boolean;
  sizes?: string;
  className?: string;
  showHint?: boolean;
  /** `contain` montre la photo entière (utilisé en plein écran), `cover` remplit le cadre */
  fit?: 'cover' | 'contain';
};

/**
 * Photo optimisée par Next.js, avec un joli remplacement si le fichier
 * n'a pas encore été déposé dans public/images/.
 * Le fichier attendu est alors affiché : plus qu'à le glisser dans le dossier.
 */
export default function RoyalPhoto({
  src,
  alt,
  priority = false,
  sizes = '(max-width: 768px) 90vw, 40vw',
  className = '',
  showHint = true,
  fit = 'cover',
}: RoyalPhotoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`relative flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,#1b0505_0%,#050505_75%)] p-6 text-center ${className}`}
      >
        <div className="absolute inset-0 opacity-[0.06] noise" aria-hidden="true" />
        <Crown className="h-10 w-10 text-royal-gold drop-shadow-[0_0_14px_rgba(245,158,11,0.7)]" />
        <p className="font-display text-sm tracking-wide text-white/80">{alt}</p>
        {showHint && (
          <p className="flex items-center gap-1.5 text-[11px] leading-relaxed text-white/40">
            <ImagePlus className="h-3.5 w-3.5 shrink-0" />
            <span className="break-all">
              Dépose <span className="text-royal-gold/80">{src.replace('/images/', '')}</span> dans
              public/images/
            </span>
          </p>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      onError={() => setFailed(true)}
      className={`${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
    />
  );
}
