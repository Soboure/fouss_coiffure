import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Sparkles, Shield, Compass, Heart, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';

import { categories, serviceCategories as pricingData } from './data/services';

export default function TarifsPage() {
  const [activeCategory, setActiveCategory] = useState<'coiffure' | 'soins' | 'boutique' | 'vip'>('coiffure');

  return (
    <div className="min-h-screen bg-creme text-charcoal font-sans">
      <Navbar />

      {/* Header Banner - High Contrast White on Charcoal */}
      <section className="relative py-24 bg-charcoal text-white overflow-hidden mt-[73px]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold-light text-xs font-bold tracking-widest uppercase">Notre Catalogue</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2">Tarifs & Prestations</h1>
            <p className="text-creme/80 text-sm md:text-base mt-4 max-w-xl leading-relaxed font-light">
              Découvrez la carte complète de nos rituels de beauté : de la coiffure sur-mesure aux massages spa, en passant par notre showroom exclusif.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Directory Main */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Category Filters */}
        <div className="flex justify-center mb-12 overflow-x-auto pb-4 scrollbar-none">
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-sable flex space-x-1 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-8 py-3 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all ${
                  activeCategory === cat.id
                    ? 'text-white bg-charcoal shadow-md'
                    : 'text-warm-brown hover:text-gold-dark hover:bg-creme'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
          >
            {pricingData[activeCategory].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white p-8 rounded-3xl border border-sable shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-xl font-serif font-bold text-charcoal group-hover:text-gold-dark transition-colors">
                      {service.name}
                    </h3>
                    <span className="text-gold-dark font-bold text-base whitespace-nowrap bg-creme px-3.5 py-1 rounded-full border border-sable">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-warm-brown text-xs md:text-sm leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-taupe pt-4 border-t border-sable/50 font-semibold">
                  <Clock size={14} className="text-gold-dark" />
                  <span>Durée : {service.duration}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* VIP Suite Spotlight Section - Accessible High Contrast */}
        <section className="bg-charcoal text-white rounded-[40px] p-8 md:p-16 relative overflow-hidden border border-warm-800 shadow-xl mb-12">
          {/* Background decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-light/10 via-transparent to-transparent z-0 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 text-gold-light text-xs font-semibold uppercase tracking-widest mb-6">
              <Sparkles size={12} className="animate-pulse" />
              <span>Expérience Privilégiée</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">La Suite VIP Fouss</h2>
            <p className="text-creme/85 text-sm md:text-base leading-relaxed mb-10 font-light">
              Bénéficiez de vos soins et prestations dans l'intimité de notre cabine privative. Spécialement aménagée avec un fauteuil massant, un écran multimédia et un service boissons raffiné, elle offre une tranquillité absolue.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="bg-white/15 p-2.5 rounded-2xl border border-white/10 shrink-0 text-gold-light">
                  <Shield size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Discrétion Totale</h4>
                  <p className="text-creme/70 text-xs mt-1">Cabine individuelle fermée.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white/15 p-2.5 rounded-2xl border border-white/10 shrink-0 text-gold-light">
                  <Compass size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Collation Premium</h4>
                  <p className="text-creme/70 text-xs mt-1">Cafés d'origine, infusions et boissons.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white/15 p-2.5 rounded-2xl border border-white/10 shrink-0 text-gold-light">
                  <Heart size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Prestations à la Carte</h4>
                  <p className="text-creme/70 text-xs mt-1">Coiffure et soins simultanés.</p>
                </div>
              </div>
            </div>

            <Link
              to="/#booking"
              className="bg-bordeaux text-white hover:bg-white px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <Calendar size={14} />
              <span>Réserver mon Instant VIP</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
