/* ============================================================================
   ⚙️  FICHIER DE PERSONNALISATION — TOUT SE MODIFIE ICI
   ----------------------------------------------------------------------------
   Tu peux changer les textes, les photos, les dates et la musique
   sans jamais toucher au reste de l'application.
   ========================================================================== */

export const birthdayConfig = {
  name: 'HM PEACE',
  nickname: 'Le Prince Exaucé',
  age: 1,
  title: 'Joyeux 1er anniversaire',
  theme: 'royal-red',

  /** Date de naissance : c'est elle qui pilote le compteur et les dates */
  birthDate: '2025-08-27',
  /** Date du 1er anniversaire (utilisée par le compte à rebours) */
  birthdayDate: '2026-08-27',

  /** Texte affiché tout au début, avant l'apparition du nom */
  introTagline: 'Une histoire a commencé il y a 1 an...',
  introButton: 'Découvrir la surprise',

  /** Hero */
  heroTitle: 'JOYEUX ANNIVERSAIRE',
  heroSubtitle: "1 an de bonheur, 1 an d'amour, 1 an de bénédictions.",

  /** La grande photo du haut — mets ici ta plus belle photo */
  heroPhoto: '/images/peace-principal.jpg',
} as const;

/* ============================================================================
   📸  LES PHOTOS
   ----------------------------------------------------------------------------
   Les photos sont rangées dans l'ordre de son histoire : de la naissance
   jusqu'à son premier anniversaire.

   • Pour REMPLACER une photo : dépose ton fichier dans public/images/ en
     gardant le même nom (peace-07.jpg par exemple). Rien d'autre à faire.
   • Pour EN AJOUTER une : dépose-la dans public/images/ puis ajoute une ligne
     ci-dessous.
   • Pour EN RETIRER une : supprime (ou commente) sa ligne.

   Le fichier public/images/LISEZ-MOI.txt garde la correspondance avec les
   noms d'origine de tes fichiers.
   ========================================================================== */

export type Photo = {
  src: string;
  caption?: string;
};

/**
 * Galerie automatique : toute image déposée dans public/images/ apparaît
 * dans la galerie, même si elle n'est pas listée ci-dessous.
 * Les photos listées gardent leur ordre et leur légende ; les nouvelles
 * viennent se placer à la suite.
 * Mets `autoDiscover: false` si tu veux n'afficher QUE la liste ci-dessous.
 */
export const gallery = {
  autoDiscover: true,
};

export const photos: Photo[] = [
  // — Les tout premiers jours —
  { src: '/images/peace-01.jpg', caption: 'Le tout premier jour 🤍' },
  { src: '/images/peace-02.jpg', caption: 'Bienvenue parmi nous, petit Prince' },
  { src: '/images/peace-03.jpg', caption: 'Si petit, et déjà tellement aimé ❤️' },
  { src: '/images/peace-04.jpg', caption: 'Veillé comme un trésor ✨' },
  { src: '/images/peace-05.jpg', caption: 'Avec sa grande sœur 🤍' },
  { src: '/images/peace-06.jpg', caption: 'Petit Prince rêveur ✨' },

  // — Les premiers mois —
  { src: '/images/peace-07.jpg', caption: 'Les premières découvertes' },
  { src: '/images/peace-08.jpg', caption: 'Il tient assis, tout fier ! 👑' },
  { src: '/images/peace-09.jpg', caption: 'Assis comme un grand' },
  { src: '/images/peace-10.jpg', caption: 'Petit champion ⚽' },
  { src: '/images/peace-11.jpg', caption: 'Les bras levés : victoire ! 🙌' },
  { src: '/images/peace-12.jpg', caption: "L'heure du goûter 🥤" },
  { src: '/images/peace-13.jpg', caption: 'Roi de sa petite chaise 👑' },
  { src: '/images/peace-14.jpg', caption: 'En route dans son trotteur 🚗' },
  { src: '/images/peace-15.jpg', caption: 'À la maison, toujours souriant 😊' },

  // — Debout, il grandit —
  { src: '/images/peace-16.jpg', caption: 'Debout, le Prince avance ! 👣' },
  { src: '/images/peace-17.jpg', caption: 'Petit explorateur ✨' },
  { src: '/images/peace-18.jpg', caption: 'Prêt pour la promenade' },
  { src: '/images/peace-19.jpg', caption: 'Curieux de tout' },
  { src: '/images/peace-20.jpg', caption: 'Il grimpe partout maintenant 😄' },
  { src: '/images/peace-21.jpg', caption: 'À toute vitesse !' },
  { src: '/images/peace-22.jpg', caption: 'Ses premiers pas dehors 👣' },

  // — La fête et la famille —
  { src: '/images/peace-23.jpg', caption: 'Les mains vers le ciel ✨' },
  { src: '/images/peace-24.jpg', caption: 'Roi du terrain de jeux 👑' },
  { src: '/images/peace-25.jpg', caption: 'En balade sur son cheval 🐴' },
  { src: '/images/peace-26.jpg', caption: 'Avec son grand frère ❤️' },
  { src: '/images/peace-principal.jpg', caption: 'Notre petit Prince 👑' },
  { src: '/images/peace-27.jpg', caption: 'Un jour de fête 🎉' },
  { src: '/images/peace-28.jpg', caption: 'Toute la tendresse du monde 🤍' },
  { src: '/images/peace-29.jpg', caption: "Entouré d'amour ❤️" },
  { src: '/images/peace-30.jpg', caption: 'Tous réunis pour lui 🎊' },
];

/* ============================================================================
   ❤️  LA SECTION « UNE ANNÉE DÉJÀ »
   ========================================================================== */

export const yearStory = {
  title: 'Une année déjà...',
  intro: 'Il y a un an, une magnifique histoire commençait.',
  lines: [
    "Le jour où tu es arrivé, la maison entière s'est illuminée.",
    'Tu as apporté le bonheur dans chacun de nos matins. ☀️',
    "Tu as apporté l'amour, celui qui ne se raconte pas mais qui se vit. ❤️",
    'Tu as apporté la joie, celle qui fait rire toute une famille. 😄',
    'Tu as apporté les bénédictions, comme une réponse à nos prières. 🙏',
    'Et tu as apporté ces sourires que rien au monde ne remplacera. ✨',
  ],
  outro: 'Une année seulement... et déjà toute une vie de bonheur.',
};

/* ============================================================================
   👑  LA TIMELINE DE SA PREMIÈRE ANNÉE
   ----------------------------------------------------------------------------
   `photo` est facultatif : mets le chemin d'une image de public/images/
   ========================================================================== */

export type TimelineStep = {
  step: string;
  title: string;
  date?: string;
  description: string;
  emoji: string;
  photo?: string;
};

/**
 * Calcule la date exacte, N mois après la naissance.
 * Comme tout part de `birthdayConfig.birthDate`, les dates restent justes
 * même si tu changes la date de naissance.
 *
 *   né le 27 août 2025  →  moisApresNaissance(0)  = 27 août 2025
 *                          moisApresNaissance(1)  = 27 septembre 2025
 *                          moisApresNaissance(12) = 27 août 2026
 */
const MOIS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

export function moisApresNaissance(mois: number): string {
  const [annee, m, jour] = birthdayConfig.birthDate.split('-').map(Number);
  const total = m - 1 + mois;
  const anneeFinale = annee + Math.floor(total / 12);
  const moisFinal = ((total % 12) + 12) % 12;
  return `${jour} ${MOIS_FR[moisFinal]} ${anneeFinale}`;
}

export const timeline: TimelineStep[] = [
  {
    step: 'Naissance',
    title: 'Le jour où tout a commencé 🤍',
    date: moisApresNaissance(0), // 27 août 2025
    description:
      "Le jour de son arrivée. Un tout petit prince, des tout petits doigts, et une maison entière qui s'illumine.",
    emoji: '🍼',
    photo: '/images/peace-01.jpg',
  },
  {
    step: '1 mois',
    title: 'Les premiers sourires ❤️',
    date: moisApresNaissance(1), // 27 septembre 2025
    description:
      "Un mois déjà. Les premiers regards, les premiers sourires, et ces nuits où on ne dort plus que d'un œil.",
    emoji: '👶',
    photo: '/images/peace-02.jpg',
  },
  {
    step: '3 mois',
    title: 'De nouvelles découvertes ✨',
    date: moisApresNaissance(3), // 27 novembre 2025
    description:
      "Les yeux grands ouverts sur le monde. Chaque bruit, chaque couleur, chaque visage devient une aventure.",
    emoji: '🌟',
    photo: '/images/peace-07.jpg',
  },
  {
    step: '6 mois',
    title: 'Toujours plus de bonheur 🥰',
    date: moisApresNaissance(6), // 27 février 2026
    description:
      "Des éclats de rire qui remplissent la maison, et des câlins dont on ne se lasse jamais.",
    emoji: '😄',
    photo: '/images/peace-11.jpg',
  },
  {
    step: '9 mois',
    title: 'Petit Prince devient grand 👑',
    date: moisApresNaissance(9), // 27 mai 2026
    description:
      "Il s'assoit, il se lève, il explore. Le petit prince prend sa place sur son trône.",
    emoji: '👑',
    photo: '/images/peace-16.jpg',
  },
  {
    step: '12 mois',
    title: '🎉 1 AN ! 🎉',
    date: moisApresNaissance(12), // 27 août 2026
    description:
      "Une année entière d'amour, de rires et de bénédictions. Le début d'une magnifique histoire.",
    emoji: '🎂',
    photo: '/images/peace-24.jpg',
  },
];

/* ============================================================================
   💌  LE MESSAGE PERSONNEL
   ----------------------------------------------------------------------------
   Chaque ligne apparaît l'une après l'autre, comme une lettre écrite à la main.
   ========================================================================== */

export const letter = {
  title: 'Pour toi, HM Peace',
  paragraphs: [
    'Mon petit frère, mon Prince Exaucé,',
    "Aujourd'hui, tu fêtes ta première année d'existence.",
    "Une année seulement, mais déjà tellement de souvenirs, de sourires et de bonheur.",
    'Que Dieu continue de te protéger, de te guider et de faire de ta vie une magnifique histoire.',
    "Que tu grandisses dans l'amour, la joie, la paix et la bénédiction.",
    'Joyeux 1er anniversaire, mon petit Prince. 👑❤️',
  ],
  signature: 'Ta grande sœur qui t’aime ❤️',
};

/* ============================================================================
   🎵  LA MUSIQUE
   ----------------------------------------------------------------------------
   Deux musiques sont prêtes dans public/audio/ :
     • birthday.mp3            → la version instrumentale (utilisée par défaut)
     • birthday-avec-voix.mp3  → la version chantée

   Pour passer à la version chantée, remplace simplement la ligne `src` par :
     src: '/audio/birthday-avec-voix.mp3',

   (La musique ne démarre JAMAIS toute seule : l'utilisateur doit cliquer.)
   ========================================================================== */

export const music = {
  src: '/audio/birthday.mp3',
  title: 'Musique de fête',
  defaultVolume: 0.45,
};

/* ============================================================================
   🧭  LA NAVIGATION
   ========================================================================== */

export const navigation = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Son histoire', href: '#histoire' },
  { label: 'Souvenirs', href: '#souvenirs' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Message', href: '#message' },
  { label: 'Le film', href: '#film' },
];

/* ============================================================================
   🎉  LA GRANDE FINALE
   ========================================================================== */

export const finale = {
  question: 'PRÊT POUR LA FÊTE ?',
  line1: 'JOYEUX ANNIVERSAIRE',
  line2: 'HM PEACE ❤️',
  line3: 'LE PRINCE EXAUCÉ 👑',
  button: 'Relancer la fête 🎊',
};
