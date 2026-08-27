/**
 * 👀 Surveillance du dossier public/images/
 * ----------------------------------------------------------------------------
 * Dès que tu déposes (ou supprimes) une photo dans public/images/, ce script
 * la détecte et rafraîchit le site : la nouvelle photo apparaît aussitôt dans
 * la galerie et dans le film, sans toucher au code.
 *
 * Lancé automatiquement par `npm run dev`.
 * Peut aussi tourner seul :  node scripts/watch-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = path.join(root, 'public', 'images');
const pageFile = path.join(root, 'app', 'page.tsx');
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;

const listImages = () => {
  try {
    return fs
      .readdirSync(imagesDir)
      .filter((f) => IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));
  } catch {
    return [];
  }
};

/** On « touche » la page pour que Next.js relise le dossier et rafraîchisse. */
const refreshSite = () => {
  try {
    const now = new Date();
    fs.utimesSync(pageFile, now, now);
  } catch {
    /* le serveur de dev n'est peut-être pas lancé : ce n'est pas grave */
  }
};

let known = listImages();
let timer = null;

console.log(`👀 Surveillance de public/images/ — ${known.length} photo(s) détectée(s).`);

const check = () => {
  const current = listImages();
  const added = current.filter((f) => !known.includes(f));
  const removed = known.filter((f) => !current.includes(f));

  if (added.length === 0 && removed.length === 0) return;

  added.forEach((f) => console.log(`  ✨ Nouvelle photo : ${f} → ajoutée à la galerie`));
  removed.forEach((f) => console.log(`  🗑️  Photo retirée : ${f}`));

  known = current;
  refreshSite();
  console.log(`  📸 ${current.length} photo(s) au total.`);
};

try {
  fs.watch(imagesDir, { persistent: true }, () => {
    // petite pause : le fichier peut être encore en cours de copie
    clearTimeout(timer);
    timer = setTimeout(check, 600);
  });
} catch {
  // Certains systèmes ne supportent pas fs.watch : on repasse en mode sondage
  setInterval(check, 2000);
}

// Filet de sécurité (copies réseau, dossiers synchronisés...)
setInterval(check, 5000);
