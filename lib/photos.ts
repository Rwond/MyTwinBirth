import fs from 'node:fs';
import path from 'node:path';
import { gallery, photos as configuredPhotos, type Photo } from '@/config/birthday';

/* ============================================================================
   Galerie automatique.
   ----------------------------------------------------------------------------
   Ce fichier lit le dossier public/images/ côté serveur : toute nouvelle photo
   déposée dedans apparaît dans la galerie ET dans le film, sans toucher au code.

   • Les photos listées dans config/birthday.ts gardent leur ordre et leur légende.
   • Les photos non listées sont ajoutées à la suite, dans l'ordre de leur nom.
   ========================================================================== */

const IMAGE_DIR = path.join(process.cwd(), 'public', 'images');
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;

/** Tri « naturel » : peace-2 avant peace-10. */
const naturalSort = (a: string, b: string) =>
  a.localeCompare(b, 'fr', { numeric: true, sensitivity: 'base' });

function readImageFiles(): string[] {
  try {
    return fs
      .readdirSync(IMAGE_DIR)
      .filter((file) => IMAGE_EXT.test(file))
      .sort(naturalSort);
  } catch {
    return [];
  }
}

/**
 * Liste finale des photos affichées par le site.
 * Appelée depuis un composant serveur (app/page.tsx).
 */
export function getGalleryPhotos(): Photo[] {
  const files = readImageFiles();
  const available = new Set(files.map((file) => `/images/${file}`));

  // 1. Les photos de la configuration, dans l'ordre choisi (si le fichier existe)
  const ordered = configuredPhotos.filter((photo) => available.has(photo.src));
  const used = new Set(ordered.map((photo) => photo.src));

  if (!gallery.autoDiscover) return ordered;

  // 2. Puis toutes les nouvelles photos déposées dans public/images/
  const discovered: Photo[] = files
    .map((file) => `/images/${file}`)
    .filter((src) => !used.has(src))
    .map((src) => ({ src }));

  const all = [...ordered, ...discovered];

  // Filet de sécurité : si le dossier est vide, on garde la liste configurée
  return all.length > 0 ? all : configuredPhotos;
}

/** Nombre de photos réellement présentes (utilisé pour les textes). */
export function getPhotoCount(): number {
  return getGalleryPhotos().length;
}
