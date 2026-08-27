import Experience from '@/components/Experience';
import { getGalleryPhotos } from '@/lib/photos';

/**
 * Composant serveur : il lit le dossier public/images/ au moment du rendu,
 * ce qui permet à toute nouvelle photo d'apparaître automatiquement
 * dans la galerie et dans le film.
 */
export default function Page() {
  const photos = getGalleryPhotos();
  return <Experience photos={photos} />;
}
