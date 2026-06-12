import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Sparkles, Shield, Compass, Heart, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';

// --- DATA ---
const categories = [
  { id: 'femme', label: 'Femmes' },
  { id: 'homme', label: 'Hommes' },
  { id: 'enfant', label: 'Enfants' },
  { id: 'vip', label: 'Forfaits & Suite VIP' },
];

const pricingData = {
  femme: [
    { name: 'Tresses Africaines', price: '15 000 FCFA', duration: '2h - 4h', desc: 'Tresses artistiques, nattes collées ou tresses classiques réalisées avec une précision experte.' },
    { name: 'Tissage & Perruque', price: '20 000 FCFA', duration: '2h', desc: 'Pose de tissage fermé/ouvert ou confection et pose de perruques de haute qualité.' },
    { name: 'Soin Profond Nappy', price: '10 000 FCFA', duration: '1h', desc: 'Soin hydratant intense sous casque à vapeur pour redonner vie à vos boucles naturelles.' },
    { name: 'Coloration & Mèches', price: '25 000 FCFA', duration: '1h30', desc: 'Coloration personnalisée ou mèches de nuances subtiles avec des produits doux pour le cheveu.' },
    { name: 'Chignon Événementiel', price: '30 000 FCFA', duration: '2h', desc: 'Coiffures raffinées, chignons hauts ou bas pour mariages, soirées et cérémonies spéciales.' },
  ],
  homme: [
    { name: 'Coupe Dégradé', price: '3 000 FCFA', duration: '30 min', desc: 'Coupe moderne sur-mesure (dégradé progressif, classique) avec finitions au rasoir.' },
    { name: 'Taille de Barbe', price: '2 000 FCFA', duration: '20 min', desc: 'Dessin de barbe précis, soin à la serviette chaude et huile hydratante parfumée.' },
    { name: 'Forfait VIP Homme', price: '10 000 FCFA', duration: '1h', desc: 'Shampoing massant, coupe premium, barbe sculptée, et gommage visage purifiant.' },
    { name: 'Soin Visage Homme', price: '8 000 FCFA', duration: '45 min', desc: 'Soin nettoyant en profondeur, gommage et masque d\'argile adapté aux peaux masculines.' },
  ],
  enfant: [
    { name: 'Coupe Garçon', price: '2 000 FCFA', duration: '25 min', desc: 'Coupe moderne et rapide, adaptée et réalisée avec douceur pour les plus jeunes.' },
    { name: 'Tresses Fillette', price: '7 000 FCFA', duration: '1h30', desc: 'Tresses légères et créatives adaptées pour protéger les cheveux fins des petites filles.' },
    { name: 'Soin Démêlant Doux', price: '4 000 FCFA', duration: '30 min', desc: 'Soin nourrissant et technique de démêlage doux sans douleur.' },
  ],
  vip: [
    { name: 'Option Suite VIP (Supplément)', price: '+5 000 FCFA', duration: 'Toute prestation', desc: 'Réalisez votre coiffure dans notre cabine privée avec fauteuil massant, boissons chaudes/froides raffinées et écran individuel.' },
    { name: 'Forfait Mariée Prestige', price: '50 000 FCFA', duration: 'Demi-journée', desc: 'Coiffure de mariée, soin préparatoire profond, essai préalable inclus, boissons et privatisation de la Suite VIP.' },
    { name: 'Forfait Gentlemens Club', price: '25 000 FCFA', duration: '2h', desc: 'Coupe + barbe complète + soin du visage complet + soin des mains dans l\'ambiance calme de la Suite VIP.' },
  ],
};

export default function TarifsPage() {
  const [activeCategory, setActiveCategory] = useState<'femme' | 'homme' | 'enfant' | 'vip'>('femme');

  return (
    <div className="min-h-screen bg-warm-100 text-warm-900 font-sans">
      <Navbar />

      {/* Header Banner */}
      <section className="relative py-24 bg-warm-900 text-white overflow-hidden mt-[73px]">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-warm-900 via-warm-900/80 to-transparent z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold-400 text-xs font-bold tracking-widest uppercase">Nos Services</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2">Tarifs & Prestations</h1>
            <p className="text-warm-400 text-sm md:text-base mt-4 max-w-xl leading-relaxed">
              Consultez notre catalogue complet de coiffure et soins capillaires pour hommes, femmes et enfants. 
              Des services professionnels exécutés par nos experts créateurs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Directory Main */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Category Filters */}
        <div className="flex justify-center mb-12 overflow-x-auto pb-4 scrollbar-none">
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-warm-200 flex space-x-1 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-8 py-3 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all relative ${
                  activeCategory === cat.id
                    ? 'text-white bg-warm-850 shadow-md'
                    : 'text-warm-600 hover:text-warm-900 hover:bg-warm-100'
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
                className="bg-white p-8 rounded-3xl border border-warm-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-xl font-serif font-bold text-warm-800 group-hover:text-gold-600 transition-colors">
                      {service.name}
                    </h3>
                    <span className="text-gold-600 font-bold text-lg whitespace-nowrap bg-gold-50 px-3.5 py-1 rounded-full border border-gold-100">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-warm-600 text-xs md:text-sm leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-warm-500 pt-4 border-t border-warm-100 font-medium">
                  <Clock size={14} className="text-gold-500" />
                  <span>Durée approximative : {service.duration}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* VIP Suite Spotlight Section */}
        <section className="bg-warm-900 text-white rounded-[40px] p-8 md:p-16 relative overflow-hidden border border-warm-800 shadow-xl mb-12">
          {/* Background pattern */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-900/40 via-transparent to-transparent z-0 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-6">
              <Sparkles size={12} className="animate-pulse" />
              <span>Expérience Exclusive</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Découvrez la Suite VIP</h2>
            <p className="text-warm-300 text-sm md:text-base leading-relaxed mb-10">
              Profitez d'un moment de détente privilégié dans un espace entièrement privatisé pour vous. 
              Notre Suite VIP a été conçue pour offrir un confort absolu et une discrétion totale pendant votre mise en beauté.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10 shrink-0 text-gold-400">
                  <Shield size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Confidentialité</h4>
                  <p className="text-warm-400 text-xs mt-1">Espace fermé et privatif.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10 shrink-0 text-gold-400">
                  <Compass size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Services inclus</h4>
                  <p className="text-warm-400 text-xs mt-1">Café, thé, boissons et collation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10 shrink-0 text-gold-400">
                  <Heart size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Détente totale</h4>
                  <p className="text-warm-400 text-xs mt-1">Fauteuil massant et écran.</p>
                </div>
              </div>
            </div>

            <Link
              to="/#booking"
              className="gold-gradient-bg gold-glow text-warm-900 px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <Calendar size={14} />
              <span>Réserver en Suite VIP</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
