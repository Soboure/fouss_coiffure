// Rôle de ce fichier : la galerie.
// Barre Coiffure, Soins, Style. Sous Coiffure : Enfant, Homme, Femme.
// Chaque photo a un nom et un prix, affichés côte à côte.
// Le prix reprend le catalogue quand la prestation existe. Sinon : Prix au salon.
// Voir ouvre la photo. Réserver envoie le nom au formulaire d'accueil.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';

type Famille = 'coiffure' | 'soins' | 'style';
type PublicCoiffure = 'enfant' | 'homme' | 'femme';
type Photo = { src: string; title: string; price: string };

const familles = [
  { id: 'coiffure', label: 'Coiffure' },
  { id: 'soins', label: 'Soins' },
  { id: 'style', label: 'Style' },
] as const;

const photosEnfant: Photo[] = [
  { src: '/galerie/enfant1.jpg', title: 'Tresses Fillette Créatives', price: 'Prix au salon' },
  { src: '/galerie/enfant2.jpg', title: 'Coupe Petit Gentleman', price: 'Prix au salon' },
  { src: '/galerie/enfant3.jpg', title: 'Tresses Protectrices Enfant', price: 'Prix au salon' },
  { src: '/galerie/enfant4.jpg', title: 'Coupe Garçon Moderne', price: 'Prix au salon' },
  { src: '/galerie/enfant5.jpg', title: 'Nattes Fillette Simples', price: 'Prix au salon' },
  { src: '/galerie/enfant6.jpg', title: 'Soin Démêlant sans Douleur', price: 'Prix au salon' },
];

const photosHomme: Photo[] = [
  { src: '/galerie/homme1.jpg', title: 'Dégradé Vagues', price: '3 000 FCFA' },
  { src: '/galerie/homme2.jpg', title: 'Forfait Barbe & Coupe', price: '5 000 FCFA' },
  { src: '/galerie/homme3.jpg', title: 'Dégradé à Blanc', price: 'Prix au salon' },
  { src: '/galerie/homme4.jpg', title: 'Contours Dessinés', price: 'Prix au salon' },
  { src: '/galerie/homme5.jpg', title: 'Taille de Barbe Traditionnelle', price: '2 000 FCFA' },
  { src: '/galerie/homme6.jpg', title: 'Afro Court Dégradé', price: '3 000 FCFA' },
  { src: '/galerie/homme7.jpg', title: 'Contours & Coloration Barbe', price: 'Prix au salon' },
  { src: '/galerie/homme8.jpg', title: 'Coupe Slick Back Dégradé', price: '3 000 FCFA' },
  { src: '/galerie/homme9.jpg', title: 'Prestation Master Barbier', price: 'Prix au salon' },
];

const photosFemme: Photo[] = [
  { src: '/galerie/femme1.jpg', title: 'Tresses Artistiques', price: '15 000 FCFA' },
  { src: '/galerie/femme2.jpg', title: 'Coiffure de Cérémonie', price: 'Prix au salon' },
  { src: '/galerie/femme3.jpg', title: 'Soin Protecteur & Nappy', price: '10 000 FCFA' },
  { src: '/galerie/femme4.jpg', title: 'Tresses & Nattes Collées', price: 'Prix au salon' },
];

const photosSoins: Photo[] = [
  { src: '/galerie/Soin1.jpg', title: 'Massage aux Pierres Chaudes', price: '25 000 FCFA' },
  { src: '/galerie/Soin2.jpg', title: 'Soin Visage Hydratant', price: '15 000 FCFA' },
  { src: '/galerie/Soin3.jpg', title: 'Rituel Capillaire & Huiles', price: '10 000 FCFA' },
  { src: '/galerie/Soin4.jpg', title: 'Aromathérapie Capillaire', price: 'Prix au salon' },
];

const photosStyle: Photo[] = [
  { src: '/galerie/Showroom1.jpg', title: 'Le Showroom', price: 'Entrée libre' },
  { src: '/galerie/Showroom2.jpg', title: 'Robes de Créateurs', price: 'Prix au salon' },
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
            <article key={photo.src} className="bg-white border border-sable rounded-2xl p-2">
              <img src={photo.src} alt={photo.title} className="w-full h-40 md:h-48 object-cover rounded-xl bg-creme" />
              <div className="mt-2 px-1 flex items-start justify-between gap-2">
                <p className="text-xs font-semibold">{photo.title}</p>
                <p className="text-xs font-bold text-bordeaux shrink-0">{photo.price}</p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOuverte(index)}
                  className="rounded-full border border-sable py-2 text-[11px] font-semibold"
                >
                  Voir
                </button>
                <Link
                  to={`/?service=${encodeURIComponent(photo.title)}#booking`}
                  className="rounded-full bg-bordeaux text-white py-2 text-[11px] font-semibold text-center"
                >
                  Réserver
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {ouverte !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 gap-4"
            onClick={() => setOuverte(null)}
          >
            <button className="absolute top-6 right-6 text-white" aria-label="Fermer">
              <X size={28} />
            </button>
            <img
              src={photos[ouverte].src}
              alt={photos[ouverte].title}
              className="max-h-[75vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex gap-3 items-center" onClick={(e) => e.stopPropagation()}>
              <p className="text-white text-sm">{photos[ouverte].title}</p>
              <p className="text-white text-sm font-semibold">{photos[ouverte].price}</p>
              <Link
                to={`/?service=${encodeURIComponent(photos[ouverte].title)}#booking`}
                className="rounded-full bg-white text-charcoal px-4 py-2 text-xs font-semibold"
              >
                Réserver
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
