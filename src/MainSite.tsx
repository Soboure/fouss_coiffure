import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Download, Sparkles, Calendar, Clock, ArrowRight, ArrowLeft, Shield, Compass, ShoppingBag } from 'lucide-react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';

// --- DATA ---
const serviceCategories = {
  coiffure: [
    { id: 'tresses', name: 'Tresses Africaines', price: '15 000 FCFA', duration: '2h - 4h', desc: 'Tresses artistiques traditionnelles ou modernes.' },
    { id: 'tissage', name: 'Tissage & Perruque', price: '20 000 FCFA', duration: '2h', desc: 'Pose professionnelle et confection sur-mesure.' },
    { id: 'nappy', name: 'Soin Profond Nappy', price: '10 000 FCFA', duration: '1h', desc: 'Soin hydratant intense pour cheveux naturels.' },
    { id: 'degrade', name: 'Coupe Dégradé Homme', price: '3 000 FCFA', duration: '30 min', desc: 'Coupe moderne avec finitions au rasoir.' }
  ],
  soins: [
    { id: 'massage', name: 'Massage Relaxant aux Huiles', price: '25 000 FCFA', duration: '1h', desc: 'Massage corporel décontractant aux huiles essentielles.' },
    { id: 'visage', name: 'Soin Visage Éclat Purifiant', price: '15 000 FCFA', duration: '45 min', desc: 'Nettoyage en profondeur et masque hydratant.' },
    { id: 'rituel', name: 'Rituel Beauté Complète', price: '45 000 FCFA', duration: '3h', desc: 'Coiffure + Soin visage + Massage (Suite VIP incluse).' }
  ],
  boutique: [
    { id: 'shopping', name: 'Session Shopping Privée', price: 'Gratuit', duration: '1h', desc: 'Accès exclusif à notre showroom de prêt-à-porter avec styliste dédié.' }
  ]
};

const allServicesList = [
  ...serviceCategories.coiffure,
  ...serviceCategories.soins,
  ...serviceCategories.boutique
];

const pillars = [
  {
    title: 'Haute Coiffure',
    desc: 'Des tresses artistiques complexes, des poses de tissages invisibles et des soins capillaires protecteurs réalisés par nos artisans experts.',
    image: '/galerie/femme1.jpg',
    link: '/tarifs'
  },
  {
    title: 'Spa & Soins Esthétiques',
    desc: 'Un sanctuaire de détente absolue : massages du corps relaxants, gommages régénérants et soins du visage ciblés pour elle et lui.',
    image: '/galerie/expert3.jpg',
    link: '/tarifs'
  },
  {
    title: 'Showroom Prêt-à-Porter',
    desc: 'Une sélection exclusive de vêtements, d\'accessoires haut de gamme et de pièces de créateurs pour affirmer votre style.',
    image: '/galerie/femme2.jpg',
    link: '/galerie'
  }
];

const team = [
  { name: 'Aïcha', role: 'Directrice & Experte Tresses', image: '/galerie/expert1.jpg', bio: 'Maîtrise absolue des tresses artistiques traditionnelles et modernes.' },
  { name: 'Fatou', role: 'Spécialiste Soins & Massages', image: '/galerie/expert3.jpg', bio: 'Experte en rituels de soins capillaires naturels et massages du corps.' },
  { name: 'Ibrahim', role: 'Maître Barbier & Visagiste', image: '/galerie/expert2.jpg', bio: 'Spécialiste des dégradés masculins de précision et soins de la barbe.' },
  { name: 'Kader', role: 'Styliste & Conseiller Mode', image: '/galerie/expert4.jpg', bio: 'Conseiller en image et responsable du showroom habillement.' },
];

export default function MainSite() {
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCat, setSelectedCat] = useState<'coiffure' | 'soins' | 'boutique'>('coiffure');
  
  // Form state
  const [formData, setFormData] = useState({
    service: '', date: '', time: '10:00', space: 'Standard', firstName: '', lastName: '', clientPhone: ''
  });

  const ticketRef = useRef<HTMLDivElement>(null);

  const downloadTicket = async () => {
    if (ticketRef.current) {
      const element = ticketRef.current;
      element.style.boxShadow = 'none';
      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: '#F8F7F4',
        useCORS: true
      });
      element.style.boxShadow = '';
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Ticket_Fouss_Maison_Beaute_${formData.firstName}_${formData.lastName}.png`;
      link.click();
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('loading');
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          clientName: `${formData.firstName} ${formData.lastName}`
        })
      });
      if (res.ok) {
        setBookingStatus('success');
      } else {
        const errorData = await res.json();
        console.error('Booking error:', errorData);
        alert(`Erreur lors de la réservation: ${errorData.error || 'Erreur de connexion'}`);
        setBookingStatus('idle');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Une erreur est survenue. Veuillez réessayer plus tard.');
      setBookingStatus('idle');
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.service) {
      alert('Veuillez sélectionner une prestation.');
      return;
    }
    if (currentStep === 2 && (!formData.date || !formData.time)) {
      alert('Veuillez choisir une date et une heure.');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const getSelectedServiceDetails = () => {
    return allServicesList.find(s => s.name === formData.service);
  };

  return (
    <div className="min-h-screen bg-creme text-charcoal font-sans">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover scale-105"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-background-of-a-golden-wave-3165-large.mp4" type="video/mp4" />
          </video>
          {/* Overlays */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-creme via-transparent to-black/35"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-gold-light text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>Maison de Beauté & Boutique Concept</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight"
          >
            L'Élégance <br/><span className="italic font-light text-gold-light">au Naturel</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-creme/90 mb-10 max-w-2xl font-light"
          >
            Coiffure d'exception, soins spa bien-être et showroom de prêt-à-porter haut de gamme. Un espace complet dédié à votre style et votre sérénité.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a 
              href="#booking"
              className="bg-gold-light text-charcoal px-10 py-5 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white hover:scale-105 active:scale-95 transform transition-all duration-300 shadow-xl"
            >
              Prendre un Rendez-vous
            </a>
          </motion.div>
        </div>
      </section>

      {/* The 3 Brand Pillars */}
      <section className="py-24 bg-white border-b border-sable/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-gold-dark text-xs font-bold tracking-widest uppercase">Notre Concept</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mt-2">Maison Fouss</h2>
            <p className="text-warm-brown mt-3 max-w-lg mx-auto text-sm leading-relaxed">
              Un lieu unique à Cotonou réunissant le meilleur du soin corporel, de l'art capillaire et de la mode vestimentaire.
            </p>
            <div className="w-16 h-0.5 bg-gold-dark mx-auto mt-5"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col h-full bg-creme rounded-3xl overflow-hidden border border-sable/40 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={pillar.image} 
                    alt={pillar.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent"></div>
                </div>
                <div className="p-8 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">{pillar.title}</h3>
                    <p className="text-warm-brown text-sm leading-relaxed mb-6">{pillar.desc}</p>
                  </div>
                  <Link 
                    to={pillar.link}
                    className="inline-flex items-center text-gold-dark text-sm font-semibold hover:underline group-hover:translate-x-1 transition-transform"
                  >
                    <span>Découvrir</span>
                    <ArrowRight size={14} className="ml-1.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-creme">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-gold-dark text-xs font-bold tracking-widest uppercase">L'Équipe</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mt-2">Nos Artisans Experts</h2>
            <p className="text-warm-brown mt-3 max-w-md mx-auto text-sm leading-relaxed">
              Des spécialistes passionnés réunis pour sublimer votre bien-être et votre élégance.
            </p>
            <div className="w-16 h-0.5 bg-gold-dark mx-auto mt-5"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-5 border border-sable/50 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center"
              >
                <div className="w-full aspect-[3/4] overflow-hidden rounded-2xl mb-5 shadow-inner">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-serif font-bold text-charcoal mb-1">{member.name}</h3>
                <span className="text-xs text-gold-dark uppercase tracking-widest font-bold mb-3">{member.role}</span>
                <p className="text-xs text-taupe leading-relaxed px-1">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-24 bg-white relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-creme rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-sable/20 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="text-gold-dark text-xs font-bold tracking-widest uppercase">Réservation en Ligne</span>
            <h2 className="text-3xl font-serif font-bold text-charcoal mt-2">Réserver votre instant</h2>
            <div className="w-16 h-0.5 bg-gold-dark mx-auto mt-4"></div>
          </div>

          <div className="bg-creme/70 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-sable shadow-sm">
            {bookingStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200">
                  <CheckCircle className="text-green-600" size={42} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-charcoal mb-3">Réservation Enregistrée !</h3>
                <p className="text-warm-brown mb-8 max-w-md mx-auto text-sm leading-relaxed">
                  Votre demande a bien été envoyée. Veuillez télécharger votre ticket ci-dessous et le conserver pour votre visite.
                </p>
                
                {/* Printable Ticket - High Contrast for Printing */}
                <div className="flex justify-center mb-8">
                  <div 
                    ref={ticketRef} 
                    className="bg-white border-2 border-charcoal border-dashed rounded-3xl p-8 max-w-sm w-full text-left relative overflow-hidden shadow-lg"
                  >
                    {/* Punch holes */}
                    <div className="absolute top-[120px] -left-3.5 w-7 h-7 bg-creme rounded-full border-r-2 border-charcoal"></div>
                    <div className="absolute top-[120px] -right-3.5 w-7 h-7 bg-creme rounded-full border-l-2 border-charcoal"></div>

                    {/* Logo Header */}
                    <div className="text-center border-b-2 border-dashed border-charcoal/30 pb-5 mb-5">
                      <div className="flex flex-col items-center justify-center">
                        <span className="font-display text-2xl font-black tracking-tight text-charcoal leading-none">FOUSS</span>
                        <span className="font-sans text-[0.5rem] tracking-[0.3em] text-gold-dark uppercase font-bold mt-1">Maison de Beauté</span>
                      </div>
                      <p className="text-[10px] text-taupe uppercase tracking-widest mt-2 font-bold">
                        TICKET DE RÉSERVATION
                      </p>
                    </div>
                    
                    {/* Details */}
                    <div className="space-y-4 text-xs text-charcoal">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-taupe uppercase tracking-wider font-semibold">Client</p>
                          <p className="font-bold truncate">{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-taupe uppercase tracking-wider font-semibold">Contact</p>
                          <p className="font-bold">{formData.clientPhone}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] text-taupe uppercase tracking-wider font-semibold">Prestation</p>
                        <p className="font-bold">{formData.service}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-sable">
                        <div>
                          <p className="text-[10px] text-taupe uppercase tracking-wider font-semibold">Date</p>
                          <p className="font-bold">{formData.date}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-taupe uppercase tracking-wider font-semibold">Heure</p>
                          <p className="font-bold">{formData.time}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-taupe uppercase tracking-wider font-semibold">Espace</p>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-block border ${
                            formData.space === 'VIP' ? 'bg-gold-dark/10 text-gold-dark border-gold-dark/20' : 'bg-creme text-charcoal border-sable'
                          }`}>
                            {formData.space === 'VIP' ? 'SUITE VIP' : 'STANDARD'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Barcode */}
                    <div className="mt-6 pt-5 border-t-2 border-dashed border-charcoal/30 text-center flex flex-col items-center">
                      <div className="h-10 flex items-center justify-center gap-0.5 mb-2 w-full max-w-[200px]" aria-hidden="true">
                        {[1, 3, 2, 1, 4, 1, 3, 2, 1, 2, 3, 1, 4, 2, 1, 2, 3, 1, 2].map((w, idx) => (
                          <div 
                            key={idx} 
                            style={{ width: `${w}px` }} 
                            className={`h-full ${idx % 3 === 0 ? 'bg-charcoal/20' : 'bg-charcoal'}`}
                          />
                        ))}
                      </div>
                      <p className="text-[9px] text-taupe font-mono tracking-widest font-semibold">
                        FOUSS-{formData.lastName.substring(0,3).toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                  <button 
                    onClick={downloadTicket}
                    className="flex items-center justify-center gap-2 bg-charcoal hover:bg-gold-dark text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex-1"
                  >
                    <Download size={16} />
                    <span>Télécharger</span>
                  </button>
                  <button 
                    onClick={() => {
                      setBookingStatus('idle');
                      setCurrentStep(1);
                      setFormData({ service: '', date: '', time: '10:00', space: 'Standard', firstName: '', lastName: '', clientPhone: '' });
                    }}
                    className="bg-transparent border border-sable text-warm-brown px-8 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider hover:bg-creme transition-colors flex-1"
                  >
                    Nouveau RDV
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleBook} className="space-y-8 text-charcoal">
                {/* Step Indicator */}
                <div className="flex justify-between items-center max-w-sm mx-auto mb-8 relative">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-sable -z-10"></div>
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gold-dark -z-10 transition-all duration-300" style={{ width: `${((currentStep - 1) / 2) * 100}%` }}></div>
                  
                  {[1, 2, 3].map((step) => (
                    <div 
                      key={step} 
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        currentStep === step 
                          ? 'bg-gold-dark text-white shadow-md scale-110 ring-4 ring-gold-dark/10' 
                          : currentStep > step 
                          ? 'bg-charcoal text-white' 
                          : 'bg-white text-taupe border border-sable'
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                <div className="min-h-[240px]">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                      >
                        <h4 className="text-base font-semibold text-charcoal text-center mb-4 font-serif">Étape 1 : Prestation & Espace</h4>
                        
                        {/* Category Select tabs */}
                        <div className="flex justify-center border-b border-sable pb-3 gap-6 text-xs font-semibold">
                          <button 
                            type="button"
                            onClick={() => { setSelectedCat('coiffure'); setFormData({...formData, service: ''}); }}
                            className={`pb-1.5 transition-colors relative ${selectedCat === 'coiffure' ? 'text-gold-dark border-b-2 border-gold-dark' : 'text-taupe hover:text-charcoal'}`}
                          >
                            Haute Coiffure
                          </button>
                          <button 
                            type="button"
                            onClick={() => { setSelectedCat('soins'); setFormData({...formData, service: ''}); }}
                            className={`pb-1.5 transition-colors relative ${selectedCat === 'soins' ? 'text-gold-dark border-b-2 border-gold-dark' : 'text-taupe hover:text-charcoal'}`}
                          >
                            Spa & Soins
                          </button>
                          <button 
                            type="button"
                            onClick={() => { setSelectedCat('boutique'); setFormData({...formData, service: ''}); }}
                            className={`pb-1.5 transition-colors relative ${selectedCat === 'boutique' ? 'text-gold-dark border-b-2 border-gold-dark' : 'text-taupe hover:text-charcoal'}`}
                          >
                            Showroom Concept
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 pt-2">
                          <div>
                            <label className="block text-xs font-bold text-warm-brown uppercase tracking-wider mb-2">Prestation</label>
                            <select 
                              required 
                              value={formData.service} 
                              onChange={e => setFormData({...formData, service: e.target.value})} 
                              className="w-full border border-sable rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:border-gold-dark shadow-inner text-charcoal font-medium"
                            >
                              <option value="">Sélectionner...</option>
                              {serviceCategories[selectedCat].map(s => (
                                <option key={s.id} value={s.name}>{s.name} ({s.price})</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-warm-brown uppercase tracking-wider mb-2">Espace de Beauté</label>
                            <div className="grid grid-cols-2 gap-3">
                              <label className={`border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                                formData.space === 'Standard' 
                                  ? 'border-gold-dark bg-white ring-2 ring-gold-dark/10 shadow-sm' 
                                  : 'border-sable bg-white/60 hover:bg-white'
                              }`}>
                                <input 
                                  type="radio" 
                                  name="space" 
                                  value="Standard" 
                                  checked={formData.space === 'Standard'} 
                                  onChange={() => setFormData({...formData, space: 'Standard'})}
                                  className="sr-only"
                                />
                                <span className="text-xs font-bold text-charcoal">Standard</span>
                                <span className="text-[9px] text-taupe mt-0.5">Cabine classique</span>
                              </label>

                              <label className={`border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                                formData.space === 'VIP' 
                                  ? 'border-gold-dark bg-white ring-2 ring-gold-dark/10 shadow-sm' 
                                  : 'border-sable bg-white/60 hover:bg-white'
                              }`}>
                                <input 
                                  type="radio" 
                                  name="space" 
                                  value="VIP" 
                                  checked={formData.space === 'VIP'} 
                                  onChange={() => setFormData({...formData, space: 'VIP'})}
                                  className="sr-only"
                                />
                                <span className="text-xs font-bold text-gold-dark flex items-center gap-0.5">
                                  Suite VIP <Sparkles size={10} />
                                </span>
                                <span className="text-[9px] text-gold-dark mt-0.5 font-medium">+5 000 FCFA</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {formData.service && (
                          <div className="bg-white p-4 rounded-xl border border-sable/60 text-xs">
                            <span className="font-bold text-charcoal">Description : </span>
                            <span className="text-warm-brown">{getSelectedServiceDetails()?.desc} </span>
                            <div className="flex gap-4 mt-2.5 font-semibold text-gold-dark">
                              <span>Durée : {getSelectedServiceDetails()?.duration}</span>
                              <span>Prix : {getSelectedServiceDetails()?.price}</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                      >
                        <h4 className="text-base font-semibold text-charcoal text-center mb-4 font-serif">Étape 2 : Date & Créneau</h4>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-warm-brown uppercase tracking-wider mb-2">Choisir une Date</label>
                            <input 
                              required 
                              type="date" 
                              min={new Date().toISOString().split('T')[0]}
                              value={formData.date} 
                              onChange={e => setFormData({...formData, date: e.target.value})} 
                              className="w-full border border-sable rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:border-gold-dark shadow-inner text-charcoal font-medium" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-warm-brown uppercase tracking-wider mb-2">Choisir l'Heure</label>
                            <select 
                              value={formData.time} 
                              onChange={e => setFormData({...formData, time: e.target.value})} 
                              className="w-full border border-sable rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:border-gold-dark shadow-inner text-charcoal font-medium"
                            >
                              <option>09:00</option>
                              <option>10:00</option>
                              <option>11:00</option>
                              <option>12:00</option>
                              <option>14:00</option>
                              <option>15:00</option>
                              <option>16:00</option>
                              <option>17:00</option>
                              <option>18:00</option>
                              <option>19:00</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                      >
                        <h4 className="text-base font-semibold text-charcoal text-center mb-4 font-serif">Étape 3 : Informations Personnelles</h4>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-warm-brown uppercase tracking-wider mb-2">Nom</label>
                            <input 
                              required 
                              type="text" 
                              placeholder="Dupont"
                              value={formData.lastName} 
                              onChange={e => setFormData({...formData, lastName: e.target.value})} 
                              className="w-full border border-sable rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:border-gold-dark shadow-inner text-charcoal font-medium" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-warm-brown uppercase tracking-wider mb-2">Prénom</label>
                            <input 
                              required 
                              type="text" 
                              placeholder="Jean"
                              value={formData.firstName} 
                              onChange={e => setFormData({...formData, firstName: e.target.value})} 
                              className="w-full border border-sable rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:border-gold-dark shadow-inner text-charcoal font-medium" 
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-warm-brown uppercase tracking-wider mb-2">Numéro de Téléphone</label>
                          <input 
                            required 
                            type="tel" 
                            placeholder="+229 97 00 00 00"
                            value={formData.clientPhone} 
                            onChange={e => setFormData({...formData, clientPhone: e.target.value})} 
                            className="w-full border border-sable rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:border-gold-dark shadow-inner text-charcoal font-medium" 
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-sable">
                  {currentStep > 1 ? (
                    <button 
                      type="button" 
                      onClick={prevStep}
                      className="flex items-center gap-1.5 text-warm-brown hover:text-gold-dark transition-colors font-semibold text-xs uppercase tracking-wider py-2 px-3"
                    >
                      <ArrowLeft size={14} />
                      <span>Retour</span>
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < 3 ? (
                    <button 
                      type="button" 
                      onClick={nextStep}
                      className="flex items-center gap-1.5 bg-charcoal hover:bg-gold-dark text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-full shadow-sm transition-all"
                    >
                      <span>Suivant</span>
                      <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={bookingStatus === 'loading'}
                      className="flex items-center gap-1.5 bg-gold-dark hover:bg-charcoal text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-full shadow-md transition-all active:scale-95"
                    >
                      {bookingStatus === 'loading' ? 'Envoi...' : 'Confirmer le Rendez-vous'}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
