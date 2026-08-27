'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Crown, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navigation, birthdayConfig } from '@/config/birthday';

/**
 * Navigation très discrète : une fine barre qui se teinte au scroll,
 * et une sidebar animée qui glisse depuis la droite sur téléphone.
 */
export default function Navigation({ visible = true }: { visible?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(navigation[0].href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = navigation.map((n) => n.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive('#' + entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // On bloque le scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) {
      window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={visible ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: visible ? 0.4 : 0 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-royal-gold/15 bg-black/55 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:py-4">
          <button
            onClick={() => go('#accueil')}
            className="group flex items-center gap-2"
            aria-label="Retour en haut"
          >
            <Crown className="h-5 w-5 text-royal-gold transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
            <span className="font-display text-sm tracking-[0.28em] text-white/80 transition-colors group-hover:text-white">
              {birthdayConfig.name}
            </span>
          </button>

          {/* Desktop */}
          <ul className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const isActive = active === item.href;
              return (
                <li key={item.href}>
                  <button
                    onClick={() => go(item.href)}
                    className="relative px-4 py-2 text-[13px] tracking-wide text-white/60 transition-colors hover:text-white"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full border border-royal-gold/30 bg-royal-red/10"
                        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                      />
                    )}
                    <span className={`relative ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Mobile */}
          <button
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-royal-gold/30 bg-black/40 text-royal-gold backdrop-blur-md md:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </motion.header>

      {/* --- Le menu mobile : une sidebar qui glisse depuis la droite --- */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[85] md:hidden">
            {/* Le voile sombre : on tape dessus pour fermer */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="absolute inset-0 h-full w-full bg-black/70 backdrop-blur-sm"
            />

            {/* La sidebar */}
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.35 }}
              onDragEnd={(_, info) => {
                // on referme d'un glissement vers la droite
                if (info.offset.x > 90 || info.velocity.x > 550) setOpen(false);
              }}
              className="absolute inset-y-0 right-0 flex w-[82%] max-w-xs flex-col border-l border-royal-gold/25 bg-gradient-to-b from-[#120404] via-[#0a0202] to-black shadow-[-25px_0_60px_rgba(0,0,0,0.8)]"
            >
              {/* Halo rouge décoratif */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 top-20 h-64 w-64 rounded-full bg-royal-red/25 blur-3xl"
                animate={{ opacity: [0.45, 0.9, 0.45] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Filet doré sur le bord */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-royal-gold/70 to-transparent"
              />

              {/* En-tête */}
              <div className="relative flex items-center justify-between px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-royal-gold" />
                  <span className="font-display text-xs tracking-[0.28em] text-white/80">
                    {birthdayConfig.name}
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-royal-gold/30 bg-black/40 text-royal-gold"
                  aria-label="Fermer le menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="gold-divider mx-5" />

              {/* Les liens */}
              <ul className="relative flex flex-1 flex-col justify-center gap-1 px-5">
                {navigation.map((item, i) => {
                  const isActive = active === item.href;
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{
                        delay: 0.07 * i + 0.12,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <button
                        onClick={() => go(item.href)}
                        className="group flex w-full items-center gap-3 rounded-xl border-b border-white/5 px-2 py-3.5 text-left transition-colors active:bg-royal-red/10"
                      >
                        <span
                          className={`font-display text-[11px] transition-colors ${
                            isActive ? 'text-royal-gold' : 'text-royal-gold/50'
                          }`}
                        >
                          0{i + 1}
                        </span>
                        <span
                          className={`font-display text-xl tracking-wide transition-colors ${
                            isActive ? 'text-white' : 'text-white/80'
                          } group-active:text-royal-red`}
                        >
                          {item.label}
                        </span>
                        {isActive && (
                          <motion.span
                            layoutId="nav-active-mobile"
                            className="ml-auto h-1.5 w-1.5 rounded-full bg-royal-red shadow-[0_0_10px_rgba(220,38,38,0.9)]"
                          />
                        )}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Pied de la sidebar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="relative px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 text-center"
              >
                <div className="gold-divider mb-4" />
                <p className="text-[10px] tracking-[0.3em] text-white/35">
                  {birthdayConfig.nickname.toUpperCase()} 👑
                </p>
                <p className="mt-2 text-[10px] text-white/20">glisse vers la droite pour fermer</p>
              </motion.div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

    </>
  );
}
