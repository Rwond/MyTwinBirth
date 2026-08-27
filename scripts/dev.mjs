/**
 * Lance le site en mode développement + la surveillance du dossier images.
 * (Utilisé par `npm run dev`.)
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Le serveur Next.js (on appelle directement le binaire local : pas de shell,
// donc ça marche pareil sous Windows, macOS et Linux)
const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next');
const next = spawn(process.execPath, [nextBin, 'dev', ...process.argv.slice(2)], {
  cwd: root,
  stdio: 'inherit',
});

// La surveillance des photos
const watcher = spawn(process.execPath, [path.join(root, 'scripts', 'watch-images.mjs')], {
  cwd: root,
  stdio: 'inherit',
});

const stopAll = (code = 0) => {
  next.kill();
  watcher.kill();
  process.exit(code);
};

next.on('exit', (code) => stopAll(code ?? 0));
watcher.on('exit', () => {
  /* si la surveillance s'arrête, le site continue de tourner */
});

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
