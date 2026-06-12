import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Download, Sparkles, User, Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';

// --- DATA ---
const services = [
  { id: 'tresses', name: 'Tresses Africaines', price: '15 000 FCFA', duration: '2h - 4h', desc: 'Tresses traditionnelles ou modernes réalisées avec soin.' },
  { id: 'tissage', name: 'Tissage & Perruque', price: '20 000 FCFA', duration: '2h', desc: 'Pose professionnelle de mèches et confection de perruques.' },
  { id: 'nappy', name: 'Soin Profond Nappy', price: '10 000 FCFA', duration: '1h', desc: 'Traitement hydratant et nourrissant pour cheveux naturels.' },
  { id: 'degrade', name: 'Coupe Dégradé (Homme)', price: '3 000 FCFA', duration: '30 min', desc: 'Coupe moderne et finitions précises.' },
  { id: 'barbe', name: 'Taille de Barbe', price: '2 000 FCFA', duration: '20 min', desc: 'Traçage et entretien de votre barbe avec soins chauds.' },
  { id: 'vip-forfait', name: 'Forfait VIP Homme', price: '10 000 FCFA', duration: '1h', desc: 'Shampoing, coupe, barbe, massage du cuir chevelu.' },
];

const galleryPreview = [
  '/galerie/femme1.jpg',
  '/galerie/homme1.jpg',
  '/galerie/enfant1.jpg',
  '/galerie/femme2.jpg',
  '/galerie/homme2.jpg',
  '/galerie/enfant2.jpg',
];

const team = [
  { name: 'Aïcha', role: 'Directrice & Experte Tresses', image: '/galerie/expert1.jpg', bio: 'Plus de 10 ans d\'expérience dans les tresses artistiques.' },
  { name: 'Ibrahim', role: 'Maître Barbier', image: '/galerie/expert2.jpg', bio: 'Spécialiste des dégradés américains et soins de la barbe.' },
  { name: 'Fatou', role: 'Spécialiste Soins Nappy', image: '/galerie/expert3.jpg', bio: 'Experte des textures crépues et soins capillaires bio.' },
  { name: 'Kader', role: 'Coiffeur Visagiste', image: '/galerie/expert4.jpg', bio: 'Créateur de styles sur-mesure adaptés à votre visage.' },
];

export default function MainSite() {
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [formData, setFormData] = useState({
    service: '', date: '', time: '10:00', space: 'Standard', firstName: '', lastName: '', clientPhone: ''
  });

  const ticketRef = useRef<HTMLDivElement>(null);

  const downloadTicket = async () => {
    if (ticketRef.current) {
      // Temporarily remove shadow for printing
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
      link.download = `Ticket_Fouss_Coiffure_${formData.firstName}_${formData.lastName}.png`;
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
        alert(`Erreur lors de la réservation: ${errorData.error || 'Erreur inconnue'}`);
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
    return services.find(s => s.name === formData.service);
  };

  return (
    <div className="min-h-screen bg-warm-100 text-warm-900 font-sans">
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
          {/* Elegant Overlays */}
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-warm-100 via-transparent to-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-gold-200 text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>Le salon de référence à Cotonou</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight"
          >
            L'Élégance <br/><span className="italic font-light text-gold-300">au Naturel</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-warm-100/90 mb-10 max-w-2xl font-light"
          >
            Vivez une expérience capillaire d'exception. Espace Standard ou Suite VIP privative pour votre confort suprême.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a 
              href="#booking"
              className="gold-gradient-bg gold-glow gold-glow-hover text-warm-900 px-10 py-5 rounded-full text-xs font-bold tracking-widest uppercase hover:scale-105 active:scale-95 transform transition-all duration-300 inline-block"
            >
              Prendre Rendez-vous
            </a>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-gold-600 text-xs font-bold tracking-widest uppercase">Portfolio</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-warm-800 mt-2">Nos Réalisations</h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {galleryPreview.map((img, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="aspect-[4/5] overflow-hidden rounded-3xl group relative shadow-md hover:shadow-xl border border-warm-200/50"
              >
                <img 
                  src={img} 
                  alt="Coiffure Fouss" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white text-sm font-medium tracking-wide">Fouss Coiffure</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/galerie" 
              className="inline-flex items-center text-gold-600 font-semibold hover:text-gold-700 transition-colors group text-sm"
            >
              <span>Découvrir toute la galerie</span>
              <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-warm-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-gold-600 text-xs font-bold tracking-widest uppercase">Savoir-faire</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-warm-800 mt-2">Nos Experts Créateurs</h2>
            <p className="text-warm-600 mt-2 max-w-md mx-auto">Une équipe dévouée pour donner vie à vos envies capillaires.</p>
            <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-4 shadow-sm border border-warm-200 hover:shadow-xl transition-all duration-300 group text-center"
              >
                <div className="relative overflow-hidden aspect-[3/4] mb-6 rounded-2xl shadow-inner">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-serif font-bold text-warm-800 mb-1">{member.name}</h3>
                <p className="text-xs text-gold-600 uppercase tracking-widest font-semibold mb-3">{member.role}</p>
                <p className="text-xs text-warm-500 px-2 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section with Multi-Step wizard */}
      <section id="booking" className="py-24 bg-white relative overflow-hidden">
        {/* Background blobs for premium feeling */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gold-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-warm-200/50 rounded-full blur-3xl opacity-40"></div>

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="text-gold-600 text-xs font-bold tracking-widest uppercase">Réservation</span>
            <h2 className="text-3xl font-serif font-bold text-warm-800 mt-2">Réserver un moment</h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="bg-warm-100/60 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-sm border border-warm-200">
            {bookingStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <CheckCircle className="text-green-600" size={42} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-warm-800 mb-3">Réservation Confirmée !</h3>
                <p className="text-warm-600 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                  Merci pour votre confiance. Veuillez télécharger et conserver votre ticket ci-dessous. Présentez-le à l'accueil le jour de votre rendez-vous.
                </p>
                
                {/* Vintage Luxury Ticket to Download */}
                <div className="flex justify-center mb-8">
                  <div 
                    ref={ticketRef} 
                    className="bg-white border border-warm-300 rounded-3xl p-8 max-w-sm w-full text-left relative overflow-hidden shadow-xl"
                  >
                    {/* Top Punch Hole Effect */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-400 to-gold-600"></div>
                    
                    {/* Circle cutouts for ticket look */}
                    <div className="absolute top-[120px] -left-3 w-6 h-6 bg-warm-100 rounded-full border-r border-warm-300"></div>
                    <div className="absolute top-[120px] -right-3 w-6 h-6 bg-warm-100 rounded-full border-l border-warm-300"></div>

                    {/* Logo Header */}
                    <div className="text-center border-b border-dashed border-warm-300 pb-5 mb-5 mt-2">
                      <div className="flex flex-col items-center justify-center">
                        <span className="font-display text-2xl font-black tracking-tight text-warm-900 leading-none">FOUSS</span>
                        <span className="font-sans text-[0.5rem] tracking-[0.3em] text-gold-600 uppercase font-bold mt-1">Coiffure</span>
                      </div>
                      <p className="text-[10px] text-warm-500 uppercase tracking-widest mt-2 bg-warm-100 px-3 py-1 rounded-full inline-block">
                        Ticket Officiel de Réservation
                      </p>
                    </div>
                    
                    {/* Ticket Details */}
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-warm-400 uppercase tracking-wider">Client</p>
                          <p className="font-medium text-warm-800 truncate">{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-warm-400 uppercase tracking-wider">Téléphone</p>
                          <p className="font-medium text-warm-800">{formData.clientPhone}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] text-warm-400 uppercase tracking-wider">Prestation</p>
                        <p className="font-medium text-warm-800">{formData.service}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-warm-200/50">
                        <div>
                          <p className="text-[10px] text-warm-400 uppercase tracking-wider">Date</p>
                          <p className="font-medium text-warm-800 text-xs">{formData.date}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-warm-400 uppercase tracking-wider">Heure</p>
                          <p className="font-medium text-warm-800 text-xs">{formData.time}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-warm-400 uppercase tracking-wider">Espace</p>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-block ${
                            formData.space === 'VIP' ? 'bg-gold-100 text-gold-800 border border-gold-300' : 'bg-warm-100 text-warm-700'
                          }`}>
                            {formData.space === 'VIP' ? 'SUITE VIP' : 'STANDARD'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Divider & Barcode */}
                    <div className="mt-6 pt-5 border-t border-dashed border-warm-300 text-center flex flex-col items-center">
                      {/* Faux Barcode */}
                      <div className="h-10 flex items-center justify-center gap-0.5 mb-2 w-full max-w-[200px]" aria-hidden="true">
                        {[1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2].map((w, idx) => (
                          <div 
                            key={idx} 
                            style={{ width: `${w}px` }} 
                            className={`h-full ${idx % 3 === 0 ? 'bg-warm-300' : 'bg-warm-900'}`}
                          />
                        ))}
                      </div>
                      <p className="text-[9px] text-warm-400 font-mono tracking-widest">
                        FOUSS-{formData.lastName.substring(0,3).toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}
                      </p>
                      <p className="text-[10px] text-warm-500 italic mt-3">À présenter le jour de votre visite.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                  <button 
                    onClick={downloadTicket}
                    className="flex items-center justify-center gap-2 bg-warm-900 text-white px-8 py-3.5 rounded-full font-medium hover:bg-black transition-all shadow-md active:scale-95 flex-1"
                  >
                    <Download size={18} />
                    <span>Télécharger le ticket</span>
                  </button>
                  <button 
                    onClick={() => {
                      setBookingStatus('idle');
                      setCurrentStep(1);
                      setFormData({ service: '', date: '', time: '10:00', space: 'Standard', firstName: '', lastName: '', clientPhone: '' });
                    }}
                    className="bg-transparent border border-warm-400 text-warm-700 px-8 py-3.5 rounded-full font-medium hover:bg-warm-200/50 transition-colors flex-1"
                  >
                    Nouveau rendez-vous
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleBook} className="space-y-8">
                {/* Step Indicator */}
                <div className="flex justify-between items-center max-w-md mx-auto mb-8 relative">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-warm-200 -z-10"></div>
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gold-500 -z-10 transition-all duration-300" style={{ width: `${((currentStep - 1) / 2) * 100}%` }}></div>
                  
                  {[1, 2, 3].map((step) => (
                    <div 
                      key={step} 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        currentStep === step 
                          ? 'bg-gold-500 text-white shadow-md scale-110 ring-4 ring-gold-100' 
                          : currentStep > step 
                          ? 'bg-gold-600 text-white' 
                          : 'bg-white text-warm-400 border border-warm-200'
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                <div className="min-h-[220px]">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        className="space-y-6"
                      >
                        <h4 className="text-lg font-serif font-semibold text-warm-800 text-center mb-4">Étape 1 : Choisissez votre prestation et l'espace</h4>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-semibold text-warm-600 uppercase tracking-wider mb-2">Prestation souhaitée</label>
                            <select 
                              required 
                              value={formData.service} 
                              onChange={e => setFormData({...formData, service: e.target.value})} 
                              className="w-full border border-warm-200 rounded-xl px-4 py-3.5 bg-white text-sm focus:outline-none focus:border-gold-500 shadow-sm transition-colors"
                            >
                              <option value="">Sélectionner un service...</option>
                              {services.map(s => (
                                <option key={s.id} value={s.name}>{s.name} ({s.price})</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-warm-600 uppercase tracking-wider mb-2">Espace de Coiffure</label>
                            <div className="grid grid-cols-2 gap-3">
                              <label className={`border rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                                formData.space === 'Standard' 
                                  ? 'border-gold-500 bg-white ring-2 ring-gold-100 shadow-sm' 
                                  : 'border-warm-200 bg-white/50 hover:bg-white'
                              }`}>
                                <input 
                                  type="radio" 
                                  name="space" 
                                  value="Standard" 
                                  checked={formData.space === 'Standard'} 
                                  onChange={() => setFormData({...formData, space: 'Standard'})}
                                  className="sr-only"
                                />
                                <span className="text-sm font-semibold text-warm-800">Standard</span>
                                <span className="text-[10px] text-warm-400 mt-1">Cabine standard</span>
                              </label>

                              <label className={`border rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                                formData.space === 'VIP' 
                                  ? 'border-gold-500 bg-white ring-2 ring-gold-100 shadow-sm' 
                                  : 'border-warm-200 bg-white/50 hover:bg-white'
                              }`}>
                                <input 
                                  type="radio" 
                                  name="space" 
                                  value="VIP" 
                                  checked={formData.space === 'VIP'} 
                                  onChange={() => setFormData({...formData, space: 'VIP'})}
                                  className="sr-only"
                                />
                                <span className="text-sm font-semibold text-gold-600 flex items-center gap-1">
                                  Suite VIP <Sparkles size={10} className="text-gold-500" />
                                </span>
                                <span className="text-[10px] text-warm-500 mt-1">+5 000 FCFA</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {formData.service && (
                          <div className="bg-white p-4 rounded-xl border border-warm-200/60 shadow-inner text-xs">
                            <span className="font-semibold text-warm-700">Détails de la prestation : </span>
                            <span className="text-warm-600">{getSelectedServiceDetails()?.desc} </span>
                            <div className="flex gap-4 mt-2 font-medium text-gold-600">
                              <span>Durée: {getSelectedServiceDetails()?.duration}</span>
                              <span>Tarif de base: {getSelectedServiceDetails()?.price}</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        className="space-y-6"
                      >
                        <h4 className="text-lg font-serif font-semibold text-warm-800 text-center mb-4">Étape 2 : Planifiez votre visite</h4>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-semibold text-warm-600 uppercase tracking-wider mb-2">Date du rendez-vous</label>
                            <input 
                              required 
                              type="date" 
                              min={new Date().toISOString().split('T')[0]}
                              value={formData.date} 
                              onChange={e => setFormData({...formData, date: e.target.value})} 
                              className="w-full border border-warm-200 rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:border-gold-500 shadow-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-warm-600 uppercase tracking-wider mb-2">Créneau horaire</label>
                            <select 
                              value={formData.time} 
                              onChange={e => setFormData({...formData, time: e.target.value})} 
                              className="w-full border border-warm-200 rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:border-gold-500 shadow-sm"
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
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        className="space-y-6"
                      >
                        <h4 className="text-lg font-serif font-semibold text-warm-800 text-center mb-4">Étape 3 : Vos coordonnées</h4>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-semibold text-warm-600 uppercase tracking-wider mb-2">Nom</label>
                            <input 
                              required 
                              type="text" 
                              placeholder="ex: Dupont"
                              value={formData.lastName} 
                              onChange={e => setFormData({...formData, lastName: e.target.value})} 
                              className="w-full border border-warm-200 rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:border-gold-500 shadow-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-warm-600 uppercase tracking-wider mb-2">Prénom</label>
                            <input 
                              required 
                              type="text" 
                              placeholder="ex: Jean"
                              value={formData.firstName} 
                              onChange={e => setFormData({...formData, firstName: e.target.value})} 
                              className="w-full border border-warm-200 rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:border-gold-500 shadow-sm" 
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-warm-600 uppercase tracking-wider mb-2">Numéro de téléphone</label>
                          <input 
                            required 
                            type="tel" 
                            placeholder="ex: +229 97 00 00 00"
                            value={formData.clientPhone} 
                            onChange={e => setFormData({...formData, clientPhone: e.target.value})} 
                            className="w-full border border-warm-200 rounded-xl px-4 py-3 bg-white text-sm focus:outline-none focus:border-gold-500 shadow-sm" 
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-warm-200">
                  {currentStep > 1 ? (
                    <button 
                      type="button" 
                      onClick={prevStep}
                      className="flex items-center gap-2 text-warm-600 hover:text-gold-600 transition-colors font-medium text-sm py-2 px-4"
                    >
                      <ArrowLeft size={16} />
                      <span>Retour</span>
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < 3 ? (
                    <button 
                      type="button" 
                      onClick={nextStep}
                      className="flex items-center gap-2 bg-warm-850 hover:bg-gold-600 text-white font-medium text-sm py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      <span>Suivant</span>
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={bookingStatus === 'loading'}
                      className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-warm-900 font-bold text-sm py-3.5 px-8 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all"
                    >
                      {bookingStatus === 'loading' ? 'Réservation en cours...' : 'Confirmer la Réservation'}
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
