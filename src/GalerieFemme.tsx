import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, Eye, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';

const photos = [
  { src: '/galerie/femme1.jpg', title: 'Tresses Artistiques', desc: 'Tresses complexes et structurées réalisées à la main par Aïcha.' },
  { src: '/galerie/femme2.jpg', title: 'Coiffure de Cérémonie', desc: 'Chignon et coiffure habillée pour événements.' },
  { src: '/galerie/femme3.jpg', title: 'Soin Protecteur & Nappy', desc: 'Hydratation profonde et nattes protectrices sur cheveux naturels.' },
  { src: '/galerie/femme4.jpg', title: 'Tresses & Nattes Collées', desc: 'Nattes protectrices plaquées au style moderne.' },
  { src: '/galerie/femme5.jpg', title: 'Box Braids Premium', desc: 'Tresses individuelles légères et durables.' },
  { src: '/galerie/femme6.jpg', title: 'Tissage Naturel Haut de Gamme', desc: 'Pose de mèches russes avec fermeture invisible.' }
];

export default function GalerieFemme() {
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
        <section className="relative py-20 bg-charcoal text-white overflow-hidden mt-[73px]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <Link 
              to="/galerie" 
              className="inline-flex items-center gap-2 text-gold-light hover:text-white transition-colors text-xs font-bold uppercase tracking-wider mb-6"
            >
              <ArrowLeft size={14} />
              <span>Retour à la Galerie</span>
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-gold-light text-xs font-bold tracking-widest uppercase">Haute Coiffure</span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2">Galerie Femmes</h1>
              <p className="text-creme/80 text-sm md:text-base mt-4 max-w-xl leading-relaxed font-light">
                Explorez nos créations capillaires féminines. Des styles traditionnels réinterprétés aux tissages modernes d'exception.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Gallery Grid */}
        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((item, index) => (
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
            ))}
          </div>
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
