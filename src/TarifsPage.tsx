import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Sparkles, Shield, Compass, Heart, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';

// --- DATA ---
const categories = [
  { id: 'coiffure', label: 'Haute Coiffure' },
  { id: 'soins', label: 'Spa & Soins Esthétiques' },
  { id: 'mode', label: 'Showroom Mode' },
  { id: 'vip', label: 'Forfaits & Suite VIP' },
];

const pricingData = {
  coiffure: [
    { name: 'Tresses Africaines', price: '15 000 FCFA', duration: '2h - 4h', desc: 'Nattes collées complexes, box braids, ou tresses artistiques personnalisées.' },
    { name: 'Tissage & Perruque', price: '20 000 FCFA', duration: '2h', desc: 'Pose de tissage avec finition naturelle invisible ou confection de perruque sur-mesure.' },
    { name: 'Soin Profond Nappy', price: '10 000 FCFA', duration: '1h', desc: 'Traitement hydratant intense sous casque à vapeur pour nourrir les boucles naturelles.' },
    { name: 'Coupe Dégradé Homme', price: '3 000 FCFA', duration: '30 min', desc: 'Tonte précise, dégradé progressif moderne et traçage de contours nets.' },
    { name: 'Taille de Barbe', price: '2 000 FCFA', duration: '20 min', desc: 'Entretien et dessin de la barbe avec soin à la serviette chaude.' },
  ],
  soins: [
    { name: 'Massage Relaxant aux Huiles', price: '25 000 FCFA', duration: '1h', desc: 'Massage corporel intégral aux huiles essentielles chaudes pour évacuer les tensions.' },
    { name: 'Soin Visage Éclat Purifiant', price: '15 000 FCFA', duration: '45 min', desc: 'Nettoyage cutané en profondeur, gommage doux et masque à l\'argile régénérant.' },
    { name: 'Rituel Gommage & Massage', price: '35 000 FCFA', duration: '1h30', desc: 'Exfoliation complète du corps suivie d\'un massage réhydratant et relaxant.' },
    { name: 'Soin Hydratant Homme', price: '8 000 FCFA', duration: '40 min', desc: 'Soin ciblé nettoyant et énergisant adapté aux spécificités de la peau masculine.' },
  ],
  mode: [
    { name: 'Accès Showroom Concept', price: 'Entrée Libre', duration: 'Lundi au Samedi', desc: 'Découvrez notre collection capsule de prêt-à-porter haut de gamme et d\'accessoires raffinés.' },
    { name: 'Session Shopping Privée', price: 'Offert', duration: '1h (Sur RDV)', desc: 'Profitez d\'un styliste dédié et de la privatisation du showroom pour vos essayages.' },
    { name: 'Conseil en Image Express', price: '10 000 FCFA', duration: '45 min', desc: 'Analyse de morphologie, colorimétrie et sélection de tenues adaptées à votre profil.' },
  ],
  vip: [
    { name: 'Option Suite VIP (Supplément)', price: '+5 000 FCFA', duration: 'Toute prestation', desc: 'Bénéficiez de votre soin dans une cabine privée luxueuse avec fauteuil massant, rafraîchissements et écran individuel.' },
    { name: 'Rituel Beauté Complète VIP', price: '45 000 FCFA', duration: '3h', desc: 'Une coiffure d\'exception combinée à un soin du visage purifiant et un massage corporel (Suite VIP incluse).' },
    { name: 'Forfait Mariage Prestige', price: '50 000 FCFA', duration: 'Demi-journée', desc: 'Soin préparatoire, essai coiffure, coiffure finale le jour J, rafraîchissements et privatisation de la Suite VIP.' },
  ],
};

export default function TarifsPage() {
  const [activeCategory, setActiveCategory] = useState<'coiffure' | 'soins' | 'mode' | 'vip'>('coiffure');

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
              className="bg-gold-light text-charcoal hover:bg-white px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 transition-all inline-flex items-center gap-2"
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
