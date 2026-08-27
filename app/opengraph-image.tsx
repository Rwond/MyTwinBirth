import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { birthdayConfig } from '@/config/birthday';

/* Image d'aperçu affichée quand le lien est partagé (WhatsApp, Messenger...).
   Elle reprend la photo principale de HM Peace, dans un cadre doré. */

export const alt = `${birthdayConfig.name} — ${birthdayConfig.nickname}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** La photo est intégrée directement dans l'image (lue au moment du build). */
function loadHeroPhoto(): string | null {
  try {
    const file = path.join(process.cwd(), 'public', birthdayConfig.heroPhoto.replace(/^\//, ''));
    return `data:image/jpeg;base64,${fs.readFileSync(file).toString('base64')}`;
  } catch {
    return null;
  }
}

export default function OpengraphImage() {
  const photo = loadHeroPhoto();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 56,
          background: 'radial-gradient(circle at 50% 45%, #7F1D1D 0%, #1a0505 45%, #050505 100%)',
          color: '#fff',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 900,
            height: 900,
            borderRadius: 900,
            background: 'radial-gradient(circle, rgba(220,38,38,0.5) 0%, rgba(5,5,5,0) 65%)',
            display: 'flex',
          }}
        />

        {photo && (
          <div
            style={{
              display: 'flex',
              width: 340,
              height: 440,
              borderRadius: 28,
              border: '6px solid #F59E0B',
              overflow: 'hidden',
              boxShadow: '0 0 70px rgba(220,38,38,0.8)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" width={328} height={428} style={{ objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', fontSize: 24, letterSpacing: 10, color: '#F59E0B' }}>
            JOYEUX 1ER ANNIVERSAIRE
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 96,
              fontWeight: 900,
              color: '#fff',
              textShadow: '0 0 60px rgba(220,38,38,0.9)',
              marginTop: 12,
            }}
          >
            {birthdayConfig.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 18 }}>
            <div style={{ display: 'flex', width: 70, height: 2, background: '#F59E0B' }} />
            <div style={{ display: 'flex', fontSize: 30, letterSpacing: 8, color: '#f5f5f5' }}>
              {birthdayConfig.nickname.toUpperCase()}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 34,
              fontSize: 24,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 520,
            }}
          >
            1 an de bonheur, 1 an d&apos;amour, 1 an de benedictions.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
