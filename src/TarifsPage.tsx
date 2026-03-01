import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const services = {
  femme: [
    { name: 'Tresses Africaines', price: '15 000 FCFA', duration: '2h - 4h', desc: 'Nattes collées, rasta, vanilles avec ou sans rajouts.' },
    { name: 'Tissage & Perruque', price: '20 000 FCFA', duration: '2h', desc: 'Pose de tissage fermé, ouvert ou confection de perruque sur mesure.' },
    { name: 'Soin Profond Nappy', price: '10 000 FCFA', duration: '1h', desc: 'Shampoing purifiant, masque ultra-hydratant et massage crânien.' },
    { name: 'Coloration', price: '15 000 FCFA', duration: '1h 30min', desc: 'Coloration complète, retouche racines ou mèches.' },
    { name: 'Lissage / Défrisage', price: '12 000 FCFA', duration: '1h 30min', desc: 'Lissage soyeux respectueux du cuir chevelu et des longueurs.' },
    { name: 'Chignon Événementiel', price: '15 000 FCFA', duration: '1h', desc: 'Coiffure élégante pour mariages, baptêmes et soirées.' },
  ],
  homme: [
    { name: 'Coupe Dégradé', price: '3 000 FCFA', duration: '30 min', desc: 'Dégradé américain, taper, ou coupe classique aux ciseaux/tondeuse.' },
    { name: 'Taille de Barbe', price: '2 000 FCFA', duration: '20 min', desc: 'Traçage précis au rasoir, soin hydratant et huile à barbe.' },
    { name: 'Forfait VIP Homme', price: '10 000 FCFA', duration: '1h', desc: 'Coupe, taille de barbe, soin du visage complet et massage.' },
    { name: 'Teinture Cheveux/Barbe', price: '5 000 FCFA', duration: '45 min', desc: 'Couverture des cheveux blancs ou changement de style.' },
    { name: 'Soin Visage Express', price: '5 000 FCFA', duration: '30 min', desc: 'Gommage désincrustant, masque point noir et hydratation.' },
    { name: 'Locks (Départ ou Entretien)', price: '15 000 FCFA', duration: '2h', desc: 'Création de locks ou reprise des racines au crochet.' },
  ]
};

export default function TarifsPage() {
  const [activeTab, setActiveTab] = useState<'femme' | 'homme'>('femme');

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#2A2A2A] font-sans">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-[#F8F7F4]/90 backdrop-blur-md border-b border-[#E5E3DC] py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-black tracking-tight text-[#2A2A2A] leading-none">FOUSS</span>
            <span className="font-sans text-[0.6rem] tracking-[0.3em] text-[#8C7A6B] uppercase font-medium mt-1">Coiffure</span>
          </Link>
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-sm font-medium text-[#6B6358] hover:text-[#8C7A6B]">Accueil</Link>
            <Link to="/tarifs" className="text-sm font-medium text-[#8C7A6B]">Tarifs</Link>
            <Link to="/" className="bg-[#8C7A6B] text-white px-6 py-2 rounded-full text-sm hover:bg-[#736356]">Réserver</Link>
          </div>
        </div>
      </nav>

      {/* Hero Tarifs */}
      <section className="relative pt-40 pb-24 px-6 text-center overflow-hidden">
        {/* 3D Video Background */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover scale-105"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-liquid-gold-flowing-in-waves-3166-large.mp4" type="video/mp4" />
          </video>
          {/* Overlays */}
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F7F4] via-[#F8F7F4]/20 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg">
            Nos <span className="italic font-light text-[#D4AF37]">Tarifs</span>
          </h1>
          <p className="text-lg text-white/90 drop-shadow-md">Découvrez nos prestations pour hommes et femmes, réalisées avec soin et passion par nos experts.</p>
        </div>
      </section>

      {/* Tarifs Content */}
      <section className="pb-20 px-6 max-w-5xl mx-auto">
        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-12">
          <button 
            onClick={() => setActiveTab('femme')}
            className={`px-8 py-3 rounded-full text-sm font-medium transition-colors ${activeTab === 'femme' ? 'bg-[#4A4238] text-white' : 'bg-white text-[#6B6358] border border-[#E5E3DC] hover:border-[#8C7A6B]'}`}
          >
            Espace Femme
          </button>
          <button 
            onClick={() => setActiveTab('homme')}
            className={`px-8 py-3 rounded-full text-sm font-medium transition-colors ${activeTab === 'homme' ? 'bg-[#4A4238] text-white' : 'bg-white text-[#6B6358] border border-[#E5E3DC] hover:border-[#8C7A6B]'}`}
          >
            Espace Homme
          </button>
        </div>

        {/* List */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#E5E3DC]">
          <div className="space-y-8">
            {services[activeTab].map((service, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E5E3DC] pb-6 last:border-0 last:pb-0">
                <div className="mb-4 md:mb-0 md:pr-8">
                  <h3 className="text-xl font-serif font-bold text-[#4A4238] mb-1">{service.name}</h3>
                  <p className="text-sm text-[#6B6358]">{service.desc}</p>
                  <span className="inline-block mt-2 text-xs font-medium bg-[#F8F7F4] text-[#8C7A6B] px-3 py-1 rounded-full">
                    Durée estimée : {service.duration}
                  </span>
                </div>
                <div className="text-2xl font-serif text-[#4A4238] whitespace-nowrap">
                  {service.price}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/" className="inline-block bg-[#8C7A6B] text-white px-8 py-4 rounded-full text-sm tracking-widest uppercase hover:bg-[#736356] transition-colors">
            Prendre Rendez-vous
          </Link>
        </div>
      </section>
    </div>
  );
}
