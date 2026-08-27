# 👑 HM PEACE — Le Prince Exaucé

Site d'anniversaire royal, animé et responsive pour la **première année** de HM Peace.
Next.js · TypeScript · Tailwind CSS · Framer Motion · Lucide React · Canvas.

---

## 🚀 Démarrer

```bash
npm install
npm run dev
```

Le site s'ouvre sur http://localhost:3000
`npm run dev` lance en même temps la **surveillance du dossier photos** (voir plus bas).

Pour la version finale (celle que tu partages) :

```bash
npm run build
npm start
```

---

## 📸 Les photos (galerie automatique)

**Les 31 photos de HM Peace sont déjà en place**, rangées dans l'ordre de son
histoire (de la naissance à son premier anniversaire).

### Ajouter une photo — rien à coder

Dépose simplement le fichier dans **`public/images/`**.
Pendant que `npm run dev` tourne, le script de surveillance la détecte :

```text
✨ Nouvelle photo : anniversaire.jpg → ajoutée à la galerie
📸 32 photo(s) au total.
```

Elle apparaît aussitôt **dans la galerie et dans le film**, à la suite des autres.

- Pour lui donner une légende ou la placer ailleurs dans l'histoire, ajoute-la
  dans la liste `photos` de `config/birthday.ts`.
- Pour **remplacer** une photo : dépose ton fichier avec le même nom
  (`peace-07.jpg` par exemple).
- Pour **retirer** une photo : supprime le fichier.
- Pour revenir à une galerie 100 % manuelle : `gallery.autoDiscover = false`.

> ⚠️ Sur le site en ligne (Vercel), les photos sont figées au moment du
> déploiement : après avoir ajouté une photo, il faut redéployer (ou relancer
> `npm run build`) pour qu'elle apparaisse.

### Les photos particulières

| Emplacement | Où le changer |
| --- | --- |
| La grande photo du haut | `birthdayConfig.heroPhoto` |
| Les 5 photos de la timeline | champ `photo` de chaque étape de `timeline` |
| L'aperçu WhatsApp | il reprend automatiquement `heroPhoto` |

Le fichier `public/images/LISEZ-MOI.txt` garde la correspondance avec les noms
d'origine de tes fichiers.

> Conseil : des images d'environ **1200 px de large** et **moins de 500 Ko**
> suffisent largement. Next.js les optimise automatiquement.

---

## 🎵 La musique

Deux musiques sont déjà en place dans `public/audio/` :

| Fichier | Contenu |
| --- | --- |
| `birthday.mp3` | la version instrumentale — **utilisée par défaut** |
| `birthday-avec-voix.mp3` | la version chantée |

Pour passer à la version chantée, une seule ligne à changer dans
`config/birthday.ts` :

```ts
export const music = {
  src: '/audio/birthday-avec-voix.mp3',
  title: 'Musique de fête',
  defaultVolume: 0.45,
};
```

La musique **ne démarre jamais toute seule** : un bouton flottant 🎵 en bas à
droite permet de jouer / mettre en pause / régler le volume. Elle démarre aussi
quand on lance **le film**.

---

## ✏️ Modifier les textes

Tout est centralisé dans **`config/birthday.ts`** :

| Ce que tu veux changer | Où |
| --- | --- |
| Prénom, surnom, âge, titre | `birthdayConfig` |
| Date de naissance et date d'anniversaire | `birthdayConfig.birthDate` / `birthdayDate` |
| Phrase d'ouverture et bouton surprise | `birthdayConfig.introTagline` / `introButton` |
| Section « Une année déjà » | `yearStory` |
| Étapes de la timeline (dates, textes, photos) | `timeline` |
| La lettre émouvante | `letter` |
| Les photos | `photos` |
| La musique | `music` |
| Le menu | `navigation` |
| La grande finale | `finale` |

Aucun autre fichier n'a besoin d'être touché.

---

## 🎬 Le film du Prince

En bas du site, une affiche « Lancer le film » ouvre un diaporama plein écran :
toutes les photos s'enchaînent avec un zoom lent (effet cinéma), les légendes
apparaissent, la musique démarre, et un générique de fin conclut la séance.

- Pause / photo suivante / précédente, barre de progression par photo
- Clavier : `espace` (pause), `←` `→` (naviguer), `Échap` (fermer)
- Sur téléphone : appuie à gauche ou à droite de l'écran
- Durée d'une photo : constante `SLIDE_MS` dans `components/PhotoFilm.tsx`

Toute photo ajoutée dans `public/images/` entre automatiquement dans le film.

---

## 👀 Le script de surveillance des photos

```bash
npm run dev            # site + surveillance (recommandé)
npm run watch:images   # surveillance seule, dans un autre terminal
npm run dev:simple     # site seul, sans surveillance
```

Le script `scripts/watch-images.mjs` surveille `public/images/` et rafraîchit le
site dès qu'une photo est ajoutée, remplacée ou supprimée.

---

## 🗂️ Structure

```text
app/
├── layout.tsx            → polices, métadonnées (aperçu WhatsApp)
├── opengraph-image.tsx   → image d'aperçu générée automatiquement
├── page.tsx              → l'assemblage de toutes les sections
└── globals.css           → palette, halos, cadres royaux

components/
├── Experience.tsx        → l'assemblage des sections (côté navigateur)
├── PhotoFilm.tsx         → 🎬 le film plein écran
├── IntroScreen.tsx       → l'ouverture spectaculaire
├── BirthdayHero.tsx      → la grande photo dans son cadre royal
├── YearSection.tsx       → « Une année déjà... »
├── Timeline.tsx          → l'année du Prince, étape par étape
├── PhotoGallery.tsx      → l'album royal + lightbox plein écran
├── Countdown.tsx         → 365 jours, 8 760 heures...
├── BirthdayMessage.tsx   → la lettre qui s'écrit mot à mot
├── RoyalSection.tsx      → la couronne et ses orbites
├── FinalCelebration.tsx  → la grande fête finale
├── MusicPlayer.tsx       → le bouton musical flottant
├── Confetti.tsx          → le canvas des confettis / feux d'artifice
├── Particles.tsx         → les particules du fond
├── Balloons.tsx          → les ballons
├── Sparkles.tsx          → les étoiles scintillantes
├── Navigation.tsx        → menu discret + menu mobile animé
├── CustomCursor.tsx      → curseur rouge (desktop uniquement)
├── ScrollProgress.tsx    → barre de progression dorée
└── Reveal.tsx            → apparitions au scroll

config/
└── birthday.ts           → ⭐ TOUTE la personnalisation

lib/
├── confetti.ts           → moteur canvas (confettis, feux d'artifice)
├── photos.ts             → lecture automatique du dossier public/images/
├── audioBus.ts           → le film peut lancer la musique
├── motion.ts             → les animations partagées
└── hooks.ts              → petits utilitaires (mobile, reduced-motion...)

scripts/
├── dev.mjs               → lance le site + la surveillance
└── watch-images.mjs      → surveille public/images/

public/
├── images/               → 📸 tes photos ici
└── audio/                → 🎵 ta musique ici
```

---

## 🎨 Palette

| Couleur | Code |
| --- | --- |
| Rouge | `#DC2626` |
| Rouge foncé | `#7F1D1D` |
| Noir | `#050505` |
| Noir secondaire | `#111111` |
| Blanc | `#FFFFFF` |
| Doré | `#F59E0B` |

Elles sont définies dans `tailwind.config.ts` (`royal-red`, `royal-gold`...) et
dans `app/globals.css`.

---

## 📱 Partage WhatsApp

Le site est pensé mobile d'abord : plein écran (`100svh`), textes qui s'adaptent,
menu animé, galerie qui se fait glisser au doigt.
Quand tu partages le lien, l'aperçu affiche automatiquement une belle carte
rouge et noire avec le nom du Prince (`app/opengraph-image.tsx`).

## 🌍 Mettre le site en ligne (pour partager le lien)

Le plus simple est **Vercel** (gratuit) :

1. Crée un compte sur vercel.com
2. Importe ce dossier (ou son dépôt Git)
3. Dans « Environment Variables », ajoute :
   `NEXT_PUBLIC_SITE_URL` = l'adresse de ton site (ex. `https://hm-peace.vercel.app`)

Cette variable sert uniquement à afficher la belle carte d'aperçu quand le lien
est partagé sur WhatsApp. Un modèle est fourni dans `.env.example`.

---

## ♿ Accessibilité

Si le téléphone ou l'ordinateur est réglé sur « réduire les animations »
(`prefers-reduced-motion`), le site reste magnifique mais devient calme :
plus de confettis en rafale, plus de mouvements continus.
