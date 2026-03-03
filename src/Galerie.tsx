import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, User, Baby } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { img } from 'motion/react-client';

const categories = [
  { id: 'femme', label: 'Femmes', icon: Users },
  { id: 'homme', label: 'Hommes', icon: User },
  { id: 'enfant', label: 'Enfants', icon: Baby },
];

const galleryData = {
  femme: [
    '/Images/femme1.jpg',
    '/Images/femme2.jpg',
    '/Images/femme3.jpg',
    '/Images/femme4.jpg',
    '/Images/femme5.jpg',
  ],
    
  homme: [
    '/Images/homme1.jpg',
    '/Images/homme2.jpg',
    '/Images/homme3.jpg',
    '/Images/homme4.jpg',
    '/Images/homme5.jpg',
    '/Images/homme6.jpg',
    '/Images/homme7.jpg',
    '/Images/homme8.jpg',
    '/Images/homme9.jpg',
    '/Images/homme10.jpg',

  ],
  enfant: [
    '/Images/enfant1.jpg',
    '/Images/enfant2.jpg',
    '/Images/enfant3.jpg',
    '/Images/enfant4.jpg',
    '/Images/enfant5.jpg',
    '/Images/enfant6.jpg',
  ],
};

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<'femme' | 'homme' | 'enfant'>('femme');

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#2A2A2A] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E3DC] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center text-[#8C7A6B] hover:text-[#736356] transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            <span className="text-sm font-medium">Retour</span>
          </Link>
          <div className="flex flex-col items-center">
            <span className="font-display text-2xl font-black tracking-tight text-[#2A2A2A] leading-none">FOUSS</span>
            <span className="font-sans text-[0.5rem] tracking-[0.3em] text-[#8C7A6B] uppercase font-medium mt-1">Galerie</span>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#4A4238] mb-4">Notre Galerie</h1>
          <p className="text-[#6B6358] max-w-2xl mx-auto">
            Explorez nos plus belles réalisations. Chaque coiffure est une œuvre d'art unique, 
            conçue pour sublimer votre beauté naturelle.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-full shadow-sm border border-[#E5E3DC] flex">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'bg-[#8C7A6B] text-white shadow-md'
                      : 'text-[#6B6358] hover:bg-[#F8F7F4]'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {galleryData[activeCategory].map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-sm border border-[#E5E3DC]"
              >
                <img
                  src={img}
                  alt={`${activeCategory} coiffure ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="bg-white/90 backdrop-blur-sm w-full py-3 px-4 rounded-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs font-bold text-[#4A4238] uppercase tracking-widest text-center">
                      {activeCategory === 'femme' ? 'Style Féminin' : activeCategory === 'homme' ? 'Style Masculin' : 'Style Enfant'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E3DC] py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[#8C7A6B] text-sm mb-4">Vous aimez ce que vous voyez ?</p>
          <Link
            to="/#booking"
            className="inline-block bg-[#8C7A6B] text-white px-8 py-3 rounded-full font-medium hover:bg-[#736356] transition-colors shadow-lg"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </footer>
    </div>
  );
}
