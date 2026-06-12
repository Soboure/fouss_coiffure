import React, { useState, useEffect } from 'react';
import { Users, User, Baby, X, Maximize2, Sparkles, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const categories = [
  { id: 'femme', label: 'Femmes', icon: Users },
  { id: 'homme', label: 'Hommes', icon: User },
  { id: 'enfant', label: 'Enfants', icon: Baby },
];

const galleryData = {
  femme: [
    '/galerie/femme1.jpg',
    '/galerie/femme2.jpg',
    '/galerie/femme3.jpg',
    '/galerie/femme4.jpg',
    '/galerie/femme5.jpg',
    '/galerie/femme6.jpg',
  ],
  homme: [
    '/galerie/homme1.jpg',
    '/galerie/homme2.jpg',
    '/galerie/homme3.jpg',
    '/galerie/homme4.jpg',
    '/galerie/homme5.jpg',
    '/galerie/homme6.jpg',
  ],
  enfant: [
    '/galerie/enfant1.jpg',
    '/galerie/enfant2.jpg',
    '/galerie/enfant3.jpg',
    '/galerie/enfant4.jpg',
    '/galerie/enfant5.jpg',
    '/galerie/enfant6.jpg',
  ],
};

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<'femme' | 'homme' | 'enfant'>('femme');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // Close lightbox on escape keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImg(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-warm-100 text-warm-900 font-sans flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Header Section */}
        <section className="relative py-24 bg-warm-900 text-white overflow-hidden mt-[73px]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-warm-900 via-warm-900/80 to-transparent z-0"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-gold-400 text-xs font-bold tracking-widest uppercase">Galerie Photo</span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2">Nos Réalisations</h1>
              <p className="text-warm-400 text-sm md:text-base mt-4 max-w-xl leading-relaxed">
                Explorez nos plus belles créations. Des tresses élaborées aux dégradés masculins impeccables, 
                chaque coiffure est une œuvre unique réalisée avec passion.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Gallery Content */}
        <main className="max-w-7xl mx-auto px-6 py-16">
          {/* Category Selector */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-1.5 rounded-full shadow-sm border border-warm-200 flex space-x-1">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all relative ${
                      isSelected
                        ? 'bg-warm-850 text-white shadow-md'
                        : 'text-warm-600 hover:text-warm-900 hover:bg-warm-100'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{cat.label}</span>
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {galleryData[activeCategory].map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedImg(img)}
                  className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-sm border border-warm-200 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <img
                    src={img}
                    alt={`${activeCategory} style`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Hover Overlay with Icon */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 text-white scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                      <Maximize2 size={20} />
                    </div>
                  </div>

                  {/* Caption badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm py-2.5 px-4 rounded-2xl border border-warm-200/50 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-bold text-warm-800 uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
                      <Sparkles size={10} className="text-gold-500" />
                      <span>
                        {activeCategory === 'femme' ? 'Création Féminine' : activeCategory === 'homme' ? 'Création Masculine' : 'Style Enfant'}
                      </span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImg(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full border border-white/10 transition-colors z-50"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>

            {/* Image display container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            >
              <img
                src={selectedImg}
                alt="Coiffure grand format"
                className="max-w-full max-h-[85vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
