# 📂 Structure du Projet - Documentation Complète

Ce document explique chaque dossier et fichier du projet, son rôle et son importance.

---

## 📁 Racine du projet

### 📄 `package.json`
**Importance : ⭐⭐⭐⭐⭐**
- Définit les dépendances du projet (Next.js, React, Framer Motion, Tailwind CSS, etc.)
- Contient les scripts npm pour lancer le projet (`npm run dev`, `npm run build`, etc.)
- Version du projet et métadonnées
- **À modifier uniquement si vous ajoutez de nouvelles dépendances**

### 📄 `package-lock.json`
**Importance : ⭐⭐⭐**
- Verrouille les versions exactes des dépendances installées
- Assure la cohérence entre les environnements de développement
- Généré automatiquement par npm, ne pas modifier manuellement

### 📄 `next.config.mjs`
**Importance : ⭐⭐⭐**
- Configuration du framework Next.js
- Définit les formats d'images optimisés (AVIF, WebP)
- Définit les tailles d'images responsive
- Définit la racine du projet pour éviter les problèmes de chemins

### 📄 `tsconfig.json`
**Importance : ⭐⭐⭐**
- Configuration du compilateur TypeScript
- Définit les règles de typage et les options du compilateur
- Assure la cohérence du typage dans tout le projet

### 📄 `tailwind.config.ts`
**Importance : ⭐⭐⭐⭐**
- Configuration de Tailwind CSS
- Définit la palette de couleurs personnalisées (royal-red, royal-gold, etc.)
- Définit les polices personnalisées
- Définit les animations personnalisées

### 📄 `postcss.config.mjs`
**Importance : ⭐⭐**
- Configuration de PostCSS pour traiter le CSS
- Utilisé par Tailwind CSS pour générer les styles

### 📄 `.gitignore`
**Importance : ⭐⭐⭐**
- Liste des fichiers/dossiers à ignorer par Git
- Empêche de committer `node_modules`, `.next`, les fichiers locaux, etc.

### 📄 `.env.example`
**Importance : ⭐⭐⭐**
- Modèle de fichier d'environnement
- Montre les variables d'environnement nécessaires (ex: `NEXT_PUBLIC_SITE_URL`)
- À copier en `.env.local` et remplir avec vos valeurs

### 📄 `README.md`
**Importance : ⭐⭐⭐⭐⭐**
- Documentation principale du projet
- Instructions pour démarrer, modifier les textes, ajouter des photos
- Guide pour mettre le site en ligne (Vercel)
- **Premier fichier à lire pour comprendre le projet**

### 📄 `next-env.d.ts`
**Importance : ⭐⭐**
- Fichier de types TypeScript généré automatiquement par Next.js
- Assure la compatibilité des types avec Next.js
- Ne pas modifier manuellement

---

## 📁 `app/` - Application Next.js

### 📄 `layout.tsx`
**Importance : ⭐⭐⭐⭐⭐**
- Layout racine de toute l'application
- Définit les polices Google (Cinzel pour les titres, Outfit pour le corps)
- Définit les métadonnées SEO (titre, description, OpenGraph, Twitter)
- Définit l'icône du site (emoji couronne SVG)
- Définit les métadonnées ngrok pour éviter la page d'avertissement
- Contient la balise `<html>` et `<body>` avec les classes CSS

### 📄 `page.tsx`
**Importance : ⭐⭐⭐⭐⭐**
- Page principale du site (route `/`)
- Assemble toutes les sections du site
- Importe et organise les composants dans l'ordre d'affichage
- **Point d'entrée principal de l'interface**

### 📄 `globals.css`
**Importance : ⭐⭐⭐⭐**
- Styles globaux de l'application
- Définit la palette de couleurs CSS personnalisées
- Définit les animations (halos, cadres royaux, effets de brillance)
- Définit les utilitaires personnalisés
- Importe Tailwind CSS

### 📄 `opengraph-image.tsx`
**Importance : ⭐⭐⭐⭐**
- Génère dynamiquement l'image d'aperçu pour le partage (WhatsApp, Facebook, etc.)
- Crée une belle carte avec le nom et le thème du site
- Utilisé automatiquement quand on partage le lien
- **Important pour le partage social**

---

## 📁 `components/` - Composants React

### 🎬 `PhotoFilm.tsx`
**Importance : ⭐⭐⭐⭐⭐**
- Composant du film plein écran (diaporama cinématographique)
- Affiche toutes les photos avec zoom lent et légendes
- Gère la lecture automatique, pause, navigation
- Contrôles clavier (espace, flèches, échap)
- Intègre la lecture de musique

### 🎭 `IntroScreen.tsx`
**Importance : ⭐⭐⭐⭐⭐**
- Écran d'introduction spectaculaire
- Animation d'apparition du nom avec effet de révélation
- Premier élément visible sur le site
- Crée l'impact visuel initial

### 👑 `BirthdayHero.tsx`
**Importance : ⭐⭐⭐⭐⭐**
- Section principale avec la grande photo
- Cadre royal décoratif avec couronne
- Titre et sous-titre de l'anniversaire
- Point focal visuel du site

### 📖 `YearSection.tsx`
**Importance : ⭐⭐⭐⭐**
- Section "Une année déjà..."
- Affiche les lignes de texte émouvantes une par une
- Animation d'apparition progressive

### 📅 `Timeline.tsx`
**Importance : ⭐⭐⭐⭐**
- Timeline verticale de la première année
- Affiche les étapes clés (naissance, 1 mois, 3 mois, etc.)
- Photos optionnelles pour chaque étape
- Dates calculées automatiquement depuis la date de naissance

### 🖼️ `PhotoGallery.tsx`
**Importance : ⭐⭐⭐⭐⭐**
- Galerie de photos responsive
- Grille de photos avec légendes
- Lightbox plein écran quand on clique sur une photo
- Navigation tactile sur mobile

### ⏱️ `Countdown.tsx`
**Importance : ⭐⭐⭐⭐**
- Compte à rebours jusqu'à l'anniversaire
- Affiche jours, heures, minutes, secondes
- Animation des chiffres

### 💌 `BirthdayMessage.tsx`
**Importance : ⭐⭐⭐⭐**
- Affiche la lettre personnelle
- Animation d'écriture mot par mot
- Effet de lettre manuscrite

### 👑 `RoyalSection.tsx`
**Importance : ⭐⭐⭐**
- Section avec la couronne animée
- Orbites tournantes autour de la couronne
- Effet visuel royal

### 🎉 `FinalCelebration.tsx`
**Importance : ⭐⭐⭐⭐**
- Grande section finale
- Affiche la question et les lignes de célébration
- Bouton pour relancer la fête
- Déclenche les confettis/feux d'artifice

### 🎵 `MusicPlayer.tsx`
**Importance : ⭐⭐⭐⭐**
- Bouton flottant pour contrôler la musique
- Play/Pause, contrôle du volume
- Positionné en bas à droite de l'écran
- Ne démarre jamais automatiquement (respect de l'utilisateur)

### 🎊 `Confetti.tsx`
**Importance : ⭐⭐⭐**
- Canvas pour les confettis et feux d'artifice
- Animation de particules colorées
- Déclenché lors de la finale

### ✨ `Particles.tsx`
**Importance : ⭐⭐⭐**
- Particules en arrière-plan
- Effet subtil de profondeur
- Animation continue légère

### 🎈 `Balloons.tsx`
**Importance : ⭐⭐⭐**
- Ballons animés flottants
- Ajoutent une ambiance festive
- Animation de montée lente

### ⭐ `Sparkles.tsx`
**Importance : ⭐⭐⭐**
- Étoiles scintillantes
- Effet de brillance ponctuel
- Animation de clignotement

### 🧭 `Navigation.tsx`
**Importance : ⭐⭐⭐⭐**
- Menu de navigation discret
- Menu mobile animé (hamburger)
- Liens vers les sections du site
- Scroll fluide vers les sections

### 🖱️ `CustomCursor.tsx`
**Importance : ⭐⭐**
- Curseur personnalisé rouge (desktop uniquement)
- Effet visuel subtil
- Désactivé sur mobile

### 📊 `ScrollProgress.tsx`
**Importance : ⭐⭐**
- Barre de progression du scroll
- Positionnée en haut de l'écran
- Indique la position dans la page

### 👁️ `Reveal.tsx`
**Importance : ⭐⭐⭐**
- Composant utilitaire pour les animations d'apparition au scroll
- Révèle le contenu quand il entre dans l'écran
- Utilisé par plusieurs autres composants

### 🏆 `Experience.tsx`
**Importance : ⭐⭐⭐⭐**
- Assemble toutes les sections côté navigateur
- Gère l'ordre d'affichage des sections
- Point de coordination des composants

### 🖼️ `RoyalPhoto.tsx`
**Importance : ⭐⭐⭐**
- Composant de photo avec cadre royal
- Utilisé pour afficher les photos individuelles
- Effet de bordure dorée

---

## 📁 `config/` - Configuration

### 📄 `birthday.ts`
**Importance : ⭐⭐⭐⭐⭐**
- **FICHIER PRINCIPAL DE PERSONNALISATION**
- Contient TOUTES les données modifiables du site :
  - Nom, surnom, âge, titre
  - Dates de naissance et d'anniversaire
  - Textes de toutes les sections
  - Liste des photos avec légendes
  - Timeline avec étapes
  - Lettre personnelle
  - Configuration de la musique
  - Menu de navigation
  - Textes de la finale
- **SEUL FICHIER À MODIFIER pour personnaliser le contenu**
- Ne nécessite aucune connaissance en code

---

## 📁 `lib/` - Bibliothèques utilitaires

### 📄 `confetti.ts`
**Importance : ⭐⭐⭐**
- Moteur canvas pour les confettis et feux d'artifice
- Gère la physique des particules
- Crée les effets visuels de célébration

### 📄 `photos.ts`
**Importance : ⭐⭐⭐⭐**
- Lecture automatique du dossier `public/images/`
- Détecte les nouvelles photos ajoutées
- Synchronise la galerie avec le système de fichiers
- Essentiel pour la galerie automatique

### 📄 `audioBus.ts`
**Importance : ⭐⭐⭐**
- Système de bus audio
- Permet au film de lancer la musique
- Coordination entre composants audio

### 📄 `motion.ts`
**Importance : ⭐⭐⭐**
- Animations partagées (Framer Motion)
- Variants d'animation réutilisables
- Assure la cohérence des animations

### 📄 `hooks.ts`
**Importance : ⭐⭐⭐**
- Hooks React personnalisés
- Utilitaires (détection mobile, reduced-motion, etc.)
- Fonctions réutilisables

---

## 📁 `scripts/` - Scripts Node.js

### 📄 `dev.mjs`
**Importance : ⭐⭐⭐⭐**
- Script de développement principal
- Lance simultanément :
  - Le serveur Next.js
  - La surveillance du dossier images
- Utilisé par `npm run dev`

### 📄 `watch-images.mjs`
**Importance : ⭐⭐⭐⭐**
- Surveillance du dossier `public/images/`
- Détecte automatiquement les photos ajoutées/supprimées
- Rafraîchit le site quand les photos changent
- Permet d'ajouter des photos sans toucher au code
- Peut être lancé seul ou avec `npm run dev`

---

## 📁 `public/` - Fichiers statiques

### 📁 `images/`
**Importance : ⭐⭐⭐⭐⭐**
- **Dossier pour toutes vos photos**
- Déposez simplement vos images ici
- Elles apparaissent automatiquement dans la galerie et le film
- Formats supportés : JPG, PNG, WebP, AVIF, GIF
- Recommandation : images ~1200px de large, <500Ko

### 📁 `audio/`
**Importance : ⭐⭐⭐⭐**
- **Dossier pour la musique**
- Contient les fichiers MP3 de fond musical
- `birthday.mp3` : version instrumentale (par défaut)
- `birthday-avec-voix.mp3` : version chantée
- Modifiable dans `config/birthday.ts`

---

## 📁 `node_modules/`
**Importance : ⭐⭐⭐**
- Contient toutes les dépendances npm installées
- Généré automatiquement, ne pas modifier
- Peut être supprimé et recréé avec `npm install`

---

## 📁 `.next/`
**Importance : ⭐⭐**
- Dossier de build Next.js
- Contient les fichiers compilés
- Généré automatiquement, ne pas modifier
- Peut être supprimé (recréé au prochain build)

---

## 📁 `.claude/`
**Importance : ⭐**
- Dossier de configuration pour Claude AI
- Fichiers de travail internes
- Ne pas modifier

---

## 🎯 Résumé par importance

### ⭐⭐⭐⭐⭐ - Critique (modification personnalisation)
- `config/birthday.ts` - **TOUTE la personnalisation**
- `app/layout.tsx` - Structure métadonnées
- `app/page.tsx` - Assemblage principal
- `components/PhotoFilm.tsx` - Film
- `components/IntroScreen.tsx` - Introduction
- `components/BirthdayHero.tsx` - Section principale
- `components/PhotoGallery.tsx` - Galerie
- `public/images/` - Vos photos

### ⭐⭐⭐⭐ - Important
- `app/globals.css` - Styles globaux
- `app/opengraph-image.tsx` - Aperçu partage
- `components/Navigation.tsx` - Menu
- `components/MusicPlayer.tsx` - Musique
- `components/FinalCelebration.tsx` - Finale
- `lib/photos.ts` - Détection photos
- `scripts/dev.mjs` - Développement
- `scripts/watch-images.mjs` - Surveillance photos

### ⭐⭐⭐ - Modéré
- `package.json` - Dépendances
- `next.config.mjs` - Config Next.js
- `tailwind.config.ts` - Config Tailwind
- `tsconfig.json` - Config TypeScript
- `README.md` - Documentation
- Composants d'animation (Confetti, Particles, etc.)

### ⭐⭐ - Secondaire
- `postcss.config.mjs` - Config PostCSS
- `.gitignore` - Git ignore
- `.env.example` - Modèle env
- `package-lock.json` - Lock versions
- `next-env.d.ts` - Types Next.js

### ⭐ - Technique (ne pas modifier)
- `node_modules/` - Dépendances
- `.next/` - Build
- `.claude/` - Config Claude

---

## 💡 Conseils

1. **Pour personnaliser le site** : Modifiez uniquement `config/birthday.ts`
2. **Pour ajouter des photos** : Déposez-les dans `public/images/`
3. **Pour changer la musique** : Remplacez les fichiers dans `public/audio/`
4. **Pour modifier le design** : Changez `tailwind.config.ts` et `app/globals.css`
5. **Pour ajouter des fonctionnalités** : Créez de nouveaux composants dans `components/`
