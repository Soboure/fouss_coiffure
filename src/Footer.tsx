import React from 'react';
import { Phone, Clock, MapPin } from 'lucide-react';

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
                Maison de Beauté et concept showroom exclusif à Cotonou. Découvrez le bien-être capillaire et corporel ultime.
              </p>
            </div>

            {/* Middle Column: Schedule */}
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-gold-light font-serif text-lg font-semibold mb-4 flex items-center gap-2 justify-center">
                <Clock size={16} />
                <span>Horaires d'Ouverture</span>
              </h4>
              <p className="text-creme/80 text-sm leading-loose">
                Lundi - Samedi : 09h00 - 20h00
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
              <a
                href="https://wa.me/22957985073"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-light text-creme/80 transition-colors flex items-center gap-2 text-sm mt-2 font-medium"
              >
                <Phone size={16} className="text-green-400" />
                <span>WhatsApp : +229 57 98 50 73</span>
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 text-center text-xs text-creme/40 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© {currentYear} Fouss Coiffure. Tous droits réservés.</p>
            <p className="font-light">Maison de Beauté & Lifestyle.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/22957985073"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center group hover:rotate-6 active:scale-95"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="transition-transform group-hover:scale-110">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </>
  );
}
