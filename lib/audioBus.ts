/* Petit pont entre le lecteur de musique et le reste du site :
   le film peut ainsi lancer la musique au moment où l'utilisateur clique. */

type MusicControls = {
  play: () => void;
  pause: () => void;
  isPlaying: () => boolean;
};

let controls: MusicControls | null = null;

export function registerMusicControls(c: MusicControls | null) {
  controls = c;
}

export function playMusic() {
  controls?.play();
}

export function pauseMusic() {
  controls?.pause();
}

export function isMusicPlaying() {
  return controls?.isPlaying() ?? false;
}
