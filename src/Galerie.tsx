import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, User, Baby } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const categories = [
  { id: 'femme', label: 'Femmes', icon: Users },
  { id: 'homme', label: 'Hommes', icon: User },
  { id: 'enfant', label: 'Enfants', icon: Baby },
];

const galleryData = {
  femme: [
    'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571442463800-1337d7af9d2f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531123414708-f52f38b154d8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615165893325-1e428a2a5303?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531123897727-8f129e1bfa82?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=800&auto=format&fit=crop',
  ],
  homme: [
    'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop',
  ],
  enfant: [
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544098485-2a2ed6da40ba?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1530651764912-85513784930d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514173040522-3f9e3ef688b4?q=80&w=800&auto=format&fit=crop',
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
