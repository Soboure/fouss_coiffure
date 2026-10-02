// Rôle de ce fichier : la galerie.
// Barre Coiffure, Soins, Style. Sous Coiffure : Enfant, Homme, Femme.
// Style, c'est le showroom en photo. Les images sont dans public/galerie.
// Un toucher ouvre la photo en grand. Un autre toucher passe à la suivante.

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';

type Famille = 'coiffure' | 'soins' | 'style';
type PublicCoiffure = 'enfant' | 'homme' | 'femme';

const familles = [
  { id: 'coiffure', label: 'Coiffure' },
  { id: 'soins', label: 'Soins' },
  { id: 'style', label: 'Style' },
] as const;

const photosEnfant = [
  { src: '/galerie/enfant1.jpg', title: 'Tresses Fillette Créatives' },
  { src: '/galerie/enfant2.jpg', title: 'Coupe Petit Gentleman' },
  { src: '/galerie/enfant3.jpg', title: 'Tresses Protectrices Enfant' },
  { src: '/galerie/enfant4.jpg', title: 'Coupe Garçon Moderne' },
  { src: '/galerie/enfant5.jpg', title: 'Nattes Fillette Simples' },
  { src: '/galerie/enfant6.jpg', title: 'Soin Démêlant sans Douleur' },
];

const photosHomme = [
  { src: '/galerie/homme1.jpg', title: 'Dégradé Vagues' },
  { src: '/galerie/homme2.jpg', title: 'Forfait Barbe & Coupe' },
  { src: '/galerie/homme3.jpg', title: 'Dégradé à Blanc' },
  { src: '/galerie/homme4.jpg', title: 'Contours Dessinés' },
  { src: '/galerie/homme5.jpg', title: 'Taille de Barbe Traditionnelle' },
  { src: '/galerie/homme6.jpg', title: 'Afro Court Dégradé' },
  { src: '/galerie/homme7.jpg', title: 'Contours & Coloration Barbe' },
  { src: '/galerie/homme8.jpg', title: 'Coupe Slick Back Dégradé' },
  { src: '/galerie/homme9.jpg', title: 'Prestation Master Barbier' },
];

const photosFemme = [
  { src: '/galerie/femme1.jpg', title: 'Tresses Artistiques' },
  { src: '/galerie/femme2.jpg', title: 'Coiffure de Cérémonie' },
  { src: '/galerie/femme3.jpg', title: 'Soin Protecteur & Nappy' },
  { src: '/galerie/femme4.jpg', title: 'Tresses & Nattes Collées' },
];

const photosSoins = [
  { src: '/galerie/Soin1.jpg', title: 'Massage aux Pierres Chaudes' },
  { src: '/galerie/Soin2.jpg', title: 'Soin Visage Hydratant' },
  { src: '/galerie/Soin3.jpg', title: 'Rituel Capillaire & Huiles' },
  { src: '/galerie/Soin4.jpg', title: 'Aromathérapie Capillaire' },
];

const photosStyle = [
  { src: '/galerie/Showroom1.jpg', title: 'Le Showroom' },
  { src: '/galerie/Showroom2.jpg', title: 'Robes de Créateurs' },
];

export default function Galerie() {
  const [famille, setFamille] = useState<Famille>('coiffure');
  const [publicCoiffure, setPublicCoiffure] = useState<PublicCoiffure>('enfant');
  const [ouverte, setOuverte] = useState<number | null>(null);

  const photos = famille === 'soins'
    ? photosSoins
    : famille === 'style'
      ? photosStyle
      : publicCoiffure === 'homme'
        ? photosHomme
        : publicCoiffure === 'femme'
          ? photosFemme
          : photosEnfant;

  const grande = photos[0];
  const suite = photos.slice(1);

  useEffect(() => {
    const fermer = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOuverte(null);
    };
    window.addEventListener('keydown', fermer);
    return () => window.removeEventListener('keydown', fermer);
  }, []);

  return (
    <div className="min-h-screen bg-creme text-charcoal font-sans flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16 flex-1">
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="bg-white p-1.5 rounded-full border border-sable flex gap-1">
            {familles.map((item) => (
              <button
                key={item.id}
                onClick={() => { setFamille(item.id); setOuverte(null); }}
                className={`px-6 py-3 rounded-full text-sm font-semibold ${
                  famille === item.id ? 'bg-bordeaux text-white' : 'text-warm-brown'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {famille === 'coiffure' && (
          <div className="flex gap-6 mb-8 text-sm font-semibold">
            {(['enfant', 'homme', 'femme'] as const).map((nom) => (
              <button
                key={nom}
                onClick={() => setPublicCoiffure(nom)}
                className={`capitalize pb-1 ${publicCoiffure === nom ? 'text-bordeaux border-b-2 border-bordeaux' : 'text-taupe'}`}
              >
                {nom}
              </button>
            ))}
          </div>
        )}

        <p className="text-sm text-taupe mb-4">{photos.length} photos</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <button key={photo.src} onClick={() => setOuverte(index)} className="text-left">
              <img src={photo.src} alt={photo.title} className="w-full h-40 md:h-48 object-cover rounded-2xl bg-white" />
              <p className="text-xs font-semibold mt-2">{photo.title}</p>
            </button>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {ouverte !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setOuverte(null)}
          >
            <button className="absolute top-6 right-6 text-white" aria-label="Fermer">
              <X size={28} />
            </button>
            <img
              src={photos[ouverte].src}
              alt={photos[ouverte].title}
              className="max-h-[85vh] max-w-full object-contain"
              onClick={(e) => {
                e.stopPropagation();
                setOuverte((ouverte + 1) % photos.length);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
