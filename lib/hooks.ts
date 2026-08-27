'use client';

import { useEffect, useState } from 'react';

/** Vrai uniquement après le montage côté client (évite les soucis d'hydratation). */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Media query réactive. */
export function useMediaQuery(query: string, defaultValue = false) {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}

/** Desktop avec une vraie souris : le curseur personnalisé n'est activé que là. */
export function useIsFinePointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

/** L'utilisateur préfère-t-il moins d'animations ? */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** Petit écran (utilisé pour alléger les effets sur téléphone). */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}
