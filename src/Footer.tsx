// Rôle de ce fichier : le pied de page, commun aux pages publiques.
// Il affiche l'adresse. Il ne gère pas les réservations.
// L'adresse affichée ici doit rester Haie Vive, Cotonou, la même que l'application.

import React from 'react';
import { Clock, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-charcoal text-white pt-16 pb-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
            {/* Left Column: Brand */}
            <div className="flex flex-col items-center md:items-start justify-center md:justify-start">
              <div className="flex flex-col items-center md:items-start mb-4">
                <span className="font-display text-3xl font-black tracking-tight text-white leading-none">
                  FOUSS
                </span>
                <span className="font-sans text-[0.6rem] tracking-[0.3em] text-gold-light uppercase font-bold mt-1">
                  Maison de Beauté
                </span>
              </div>
              <p className="text-creme/70 text-xs md:text-sm max-w-xs leading-relaxed font-light">
                Maison de Beauté et concept showroom exclusif. Découvrez le bien-être capillaire et corporel ultime.
              </p>
            </div>

            {/* Middle Column: Schedule */}
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-gold-light font-serif text-lg font-semibold mb-4 flex items-center gap-2 justify-center">
                <Clock size={16} />
                <span>Horaires d'Ouverture</span>
              </h4>
              <p className="text-creme/80 text-sm leading-loose">
                Lundi - Samedi : 09h00 - 23h00
              </p>
              <p className="text-creme/50 text-xs mt-2 italic">
                Dimanche : Fermé (Uniquement sur événement VIP)
              </p>
            </div>

            {/* Right Column: Contact & Address */}
            <div className="flex flex-col items-center md:items-end justify-center md:justify-start">
              <h4 className="text-gold-light font-serif text-lg font-semibold mb-4 flex items-center gap-2 md:flex-row-reverse justify-center md:justify-start">
                <MapPin size={16} />
                <span>Nous Trouver</span>
              </h4>
              <p className="text-creme/80 text-sm mb-2 text-center md:text-right">
                Haie Vive, Avenue Jean-Paul II, Cotonou, Bénin
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 text-center text-xs text-creme/40 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© {currentYear} Fouss Coiffure. Tous droits réservés.</p>
            <p className="font-light">Maison de Beauté & Lifestyle.</p>
          </div>
        </div>
      </footer>

    </>
  );
}
