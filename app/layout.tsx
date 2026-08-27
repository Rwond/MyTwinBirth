import type { Metadata, Viewport } from 'next';
import { Cinzel, Outfit } from 'next/font/google';
import './globals.css';
import { birthdayConfig } from '@/config/birthday';

const display = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

const body = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const description = `${birthdayConfig.title} ${birthdayConfig.name} 👑 ${birthdayConfig.nickname} — 1 an de bonheur, 1 an d'amour, 1 an de bénédictions. ❤️`;

export function generateMetadata(): Metadata {
  /* Adresse du site une fois en ligne — sert à construire l'aperçu WhatsApp.
     À définir dans un fichier .env.local : NEXT_PUBLIC_SITE_URL=https://mon-site.vercel.app */
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  // Toujours définir metadataBase avec une URL valide pour éviter l'erreur de build
  let metadataBase: URL;
  try {
    metadataBase = new URL(siteUrl && siteUrl.length > 0 ? siteUrl : 'http://localhost:3000');
  } catch {
    // En cas d'erreur, utiliser localhost par défaut
    metadataBase = new URL('http://localhost:3000');
  }

  const metadata: Metadata = {
    metadataBase,
    title: `👑 ${birthdayConfig.name} — ${birthdayConfig.title}`,
    description,
    openGraph: {
      title: `👑 ${birthdayConfig.name} — ${birthdayConfig.nickname}`,
      description,
      type: 'website',
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `👑 ${birthdayConfig.name} — ${birthdayConfig.nickname}`,
      description,
    },
    icons: {
      icon: [
        {
          url:
            'data:image/svg+xml,' +
            encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="80" font-size="80">👑</text></svg>'
            ),
        },
      ],
    },
    other: {
      'ngrok-skip-browser-warning': 'true',
    },
  };

  return metadata;
}

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* suppressHydrationWarning : certaines extensions de navigateur (mode sombre,
       correcteurs, traduction automatique) modifient le HTML avant que React ne
       s'installe. Sans ça, React signale une erreur d'hydratation. */
    <html
      lang="fr"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-royal-black font-body text-white antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
