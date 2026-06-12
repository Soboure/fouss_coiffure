import React, { useState, useEffect } from 'react';
import { Sparkles, X, Maximize2, Scissors, Heart, ShoppingBag, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const categories = [
  { id: 'coiffure', label: 'Haute Coiffure', icon: Scissors },
  { id: 'soins', label: 'Spa & Esthétique', icon: Heart },
  { id: 'mode', label: 'Showroom Mode', icon: ShoppingBag },
];

const galleryData = {
  soins: [
    { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800', title: 'Massage aux Pierres Chaudes', desc: 'Massage corporel décontractant pour libérer le stress.' },
    { src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800', title: 'Soin Visage Hydratant', desc: 'Purification cutanée et masque hydratant régénérant.' },
    { src: '/galerie/expert3.jpg', title: 'Rituel Capillaire & Huiles', desc: 'Soin profond du cuir chevelu par nos esthéticiennes.' },
    { src: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800', title: 'Aromathérapie Capillaire', desc: 'Application d\'huiles précieuses bio pour la fibre.' },
    { src: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800', title: 'Espace Détente & Bain', desc: 'Atmosphère calme pour vos rituels spa.' }
  ],
  mode: [
    { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800', title: 'Le Showroom Concept', desc: 'Notre espace d\'exposition prêt-à-porter à la Haie Vive.' },
    { src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800', title: 'Robes de Créateurs', desc: 'Pièces uniques sélectionnées pour vos événements.' },
    { src: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800', title: 'Accessoires de Mode', desc: 'Maroquinerie fine et bijoux d\'artisans créateurs.' },
    { src: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800', title: 'Prêt-à-Porter Masculin', desc: 'Ensembles en lin et tenues élégantes de créateurs.' }
  ]
};

export default function Galerie() {
  const [activeCategory, setActiveCategory] = useState<'coiffure' | 'soins' | 'mode'>('coiffure');
  const [selectedImg, setSelectedImg] = useState<{ src: string, title: string, desc: string } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImg(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-creme text-charcoal font-sans flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Header - White on Charcoal */}
        <section className="relative py-24 bg-charcoal text-white overflow-hidden mt-[73px]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-gold-light text-xs font-bold tracking-widest uppercase">Galerie Visuelle</span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2">Maison Fouss en Images</h1>
              <p className="text-creme/80 text-sm md:text-base mt-4 max-w-xl leading-relaxed font-light">
                Parcourez nos réalisations : l'art capillaire protecteur, l'apaisement de nos soins esthétiques et l'inspiration mode de notre showroom.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-6 py-16">
          {/* Category Filter Pills */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-4 scrollbar-none">
            <div className="bg-white p-1.5 rounded-full shadow-sm border border-sable flex space-x-1 shrink-0">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all ${
                      isSelected
                        ? 'bg-charcoal text-white shadow-md'
                        : 'text-warm-brown hover:text-gold-dark hover:bg-creme'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {activeCategory === 'coiffure' ? (
                <>
                  {/* Card Femmes */}
                  <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-sm border border-sable flex flex-col justify-end p-8">
                    <img 
                      src="/galerie/femme1.jpg" 
                      alt="Coiffure Femmes" 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent z-0"></div>
                    <div className="relative z-10 text-white">
                      <span className="text-gold-light text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
                        <Sparkles size={10} />
                        <span>Créativité & Protection</span>
                      </span>
                      <h3 className="text-2xl font-serif font-bold mb-2 text-white">Coiffure Femmes</h3>
                      <p className="text-creme/75 text-xs mb-6 leading-relaxed font-light">Nattes artistiques, tresses collées, perruques et soins profonds nappy.</p>
                      <Link 
                        to="/galerie/femmes" 
                        className="inline-flex items-center justify-center bg-gold-light text-charcoal py-3 px-6 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md w-full"
                      >
                        Découvrir la Galerie
                      </Link>
                    </div>
                  </div>

                  {/* Card Hommes */}
                  <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-sm border border-sable flex flex-col justify-end p-8">
                    <img 
                      src="/galerie/homme1.jpg" 
                      alt="Coiffure Hommes" 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent z-0"></div>
                    <div className="relative z-10 text-white">
                      <span className="text-gold-light text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
                        <Sparkles size={10} />
                        <span>Précision & Style</span>
                      </span>
                      <h3 className="text-2xl font-serif font-bold mb-2 text-white">Coiffure Hommes</h3>
                      <p className="text-creme/75 text-xs mb-6 leading-relaxed font-light">Dégradés américains, tailles de barbe à l'ancienne et rituels visagistes.</p>
                      <Link 
                        to="/galerie/hommes" 
                        className="inline-flex items-center justify-center bg-gold-light text-charcoal py-3 px-6 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md w-full"
                      >
                        Découvrir la Galerie
                      </Link>
                    </div>
                  </div>

                  {/* Card Enfants */}
                  <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-sm border border-sable flex flex-col justify-end p-8">
                    <img 
                      src="/galerie/enfant1.jpg" 
                      alt="Coiffure Enfants" 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent z-0"></div>
                    <div className="relative z-10 text-white">
                      <span className="text-gold-light text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
                        <Sparkles size={10} />
                        <span>Douceur & Confort</span>
                      </span>
                      <h3 className="text-2xl font-serif font-bold mb-2 text-white">Coiffure Enfants</h3>
                      <p className="text-creme/75 text-xs mb-6 leading-relaxed font-light">Coupes garçons rapides et tresses douces protectrices pour fillettes.</p>
                      <Link 
                        to="/galerie/enfants" 
                        className="inline-flex items-center justify-center bg-gold-light text-charcoal py-3 px-6 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-md w-full"
                      >
                        Découvrir la Galerie
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                galleryData[activeCategory as 'soins' | 'mode'].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedImg(item)}
                    className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-sm border border-sable cursor-pointer hover:shadow-md transition-all duration-300"
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/95 text-charcoal p-3.5 rounded-full border border-sable scale-75 group-hover:scale-100 transition-all duration-300 shadow-md">
                        <Eye size={18} className="text-gold-dark" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-2xl border border-sable/50 shadow-sm">
                      <h4 className="text-sm font-bold text-charcoal font-serif">{item.title}</h4>
                      <p className="text-[11px] text-taupe mt-1 truncate">{item.desc}</p>
                    </div>
                  </motion.div>
                ))
              )}
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
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImg(null)}
          >
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute top-6 right-6 text-creme/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full border border-white/10 transition-colors z-50"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl max-h-[85vh] bg-charcoal rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-hidden flex items-center justify-center bg-black max-h-[65vh]">
                <img
                  src={selectedImg.src}
                  alt={selectedImg.title}
                  className="max-w-full max-h-[65vh] object-contain"
                />
              </div>
              <div className="bg-charcoal p-6 text-white border-t border-white/10">
                <h3 className="text-xl font-serif font-bold text-gold-light">{selectedImg.title}</h3>
                <p className="text-creme/75 text-sm mt-1.5 leading-relaxed">{selectedImg.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
