// Rôle de ce fichier : la page d'accueil.
// Hero, trois portes, équipe, puis le formulaire de rendez-vous en trois étapes.
// Étape 1 : prestation et Standard ou Suite VIP. Étape 2 : jour et heure. Étape 3 : nom et téléphone.
// À l'envoi, la fiche part vers /api/reservations avec source = site.
// Le code du ticket est créé une seule fois, ici, avant l'envoi. Forme FOUSS-XXX-1234.

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Download, Sparkles, Calendar, Clock, ArrowRight, ArrowLeft, Shield, Compass, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';

import { allServicesList } from './data/services';

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
  const [ticketCode, setTicketCode] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [formData, setFormData] = useState({
    service: '', date: '', time: '10:00', space: 'Standard', firstName: '', lastName: '', clientPhone: ''
  });

  useEffect(() => {
    const nom = new URLSearchParams(window.location.search).get('service');
    if (!nom) return;
    setFormData(actuel => ({ ...actuel, service: nom }));
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const ticketRef = useRef<HTMLDivElement>(null);

  const [messageTicket, setMessageTicket] = useState('');
  const [imageTicket, setImageTicket] = useState('');

  const chargerLogo = () => new Promise<HTMLImageElement | null>((resoudre) => {
    const logo = new Image();
    logo.onload = () => resoudre(logo);
    logo.onerror = () => resoudre(null);
    logo.src = '/logo-fouss.png';
  });

  const downloadTicket = async () => {
    setMessageTicket('');
    try {
      const toile = document.createElement('canvas');
      toile.width = 800;
      toile.height = 1120;
      const crayon = toile.getContext('2d');
      if (!crayon) throw new Error('toile');
      crayon.fillStyle = '#FFFFFF';
      crayon.fillRect(0, 0, 800, 1120);
      crayon.strokeStyle = '#2B211C';
      crayon.lineWidth = 6;
      crayon.strokeRect(28, 28, 744, 1064);

      const logo = await chargerLogo();
      let haut = 80;
      if (logo) {
        const largeurLogo = 420;
        const hauteurLogo = logo.height * (largeurLogo / logo.width);
        crayon.drawImage(logo, (800 - largeurLogo) / 2, 70, largeurLogo, hauteurLogo);
        haut = 70 + hauteurLogo + 36;
      }
      crayon.fillStyle = '#7A655E';
      crayon.font = '22px sans-serif';
      crayon.textAlign = 'center';
      crayon.fillText('TICKET DE RESERVATION', 400, haut);
      crayon.fillStyle = '#2B211C';
      crayon.font = 'bold 32px monospace';
      crayon.fillText(ticketCode || 'FOUSS', 400, haut + 42);

      const lignes = [
        ['Client', formData.firstName + ' ' + formData.lastName],
        ['Telephone', formData.clientPhone],
        ['Prestation', formData.service],
        ['Prix', prixDemande()],
        ['Quand', formData.date + ' a ' + formData.time],
        ['Espace', formData.space === 'VIP' ? 'Suite VIP' : 'Standard'],
      ];
      let y = haut + 100;
      lignes.forEach(([titre, valeur]) => {
        crayon.textAlign = 'left';
        crayon.fillStyle = '#7A655E';
        crayon.font = '20px sans-serif';
        crayon.fillText(titre.toUpperCase(), 70, y);
        crayon.fillStyle = '#2B211C';
        crayon.font = 'bold 28px sans-serif';
        crayon.fillText(valeur || '-', 70, y + 34);
        y += 78;
      });
      crayon.fillStyle = '#7A655E';
      crayon.font = '20px sans-serif';
      crayon.textAlign = 'center';
      crayon.fillText('Haie Vive, Cotonou', 400, 1040);
      crayon.fillText("A presenter a l'accueil", 400, 1072);

      const image = toile.toDataURL('image/png');
      setImageTicket(image);
      const lien = document.createElement('a');
      lien.href = image;
      lien.download = 'Ticket-FOUSS-' + (ticketCode || 'reservation') + '.png';
      document.body.appendChild(lien);
      lien.click();
      lien.remove();
      setMessageTicket('Le fichier Ticket-FOUSS.png doit se trouver dans les telechargements.');
    } catch {
      setMessageTicket("Le bouton n'a pas pu lancer le fichier. Utilisez le lien sous le ticket.");
    }
  };

  const prixDemande = () => {
    const details = allServicesList.find(s => s.name === formData.service);
    const prix = details?.price || '';
    if (formData.space === 'VIP' && !prix.startsWith('+')) return `${prix} + suite 5 000 FCFA`;
    return prix;
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('loading');
    const lettres = (formData.lastName || 'CLI').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'CLI';
    const code = `FOUSS-${lettres}-${1000 + Math.floor(Math.random() * 9000)}`;
    setTicketCode(code);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          clientName: `${formData.firstName} ${formData.lastName}`,
          code,
          price: prixDemande(),
          source: 'site'
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
            Coiffure d'exception, soins spa bien-être et  prêt-à-porter haut de gamme. Un espace complet dédié à votre style et votre sérénité.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a 
              href="#booking"
              className="bg-bordeaux text-white px-10 py-5 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white hover:scale-105 active:scale-95 transform transition-all duration-300 shadow-xl"
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
              Des lieux unique au Bénin réunissant le meilleur du soin corporel, de l'art capillaire et de la mode vestimentaire.
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
      <section id="booking" className="py-20 bg-creme">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-charcoal">Prendre rendez-vous</h2>
            <p className="text-warm-brown text-sm mt-3 leading-relaxed">
              Trois étapes. Le salon reçoit la demande et la confirme. Le dimanche, le salon n'ouvre que pour un événement VIP.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-sable">
            {bookingStatus === 'success' ? (
              <div className="text-center py-4">
                <CheckCircle className="text-green-600 mx-auto" size={40} />
                <h3 className="text-2xl font-serif font-bold mt-4">Demande envoyée</h3>
                <p className="text-warm-brown text-sm mt-2">Gardez le ticket. Le salon peut encore confirmer le créneau.</p>
                <div ref={ticketRef} className="bg-white border border-charcoal rounded-3xl p-6 mt-6 text-left max-w-sm mx-auto">
                  <img src="/logo-fouss.png" alt="Fouss Coiffure" className="h-12 w-auto mx-auto" />
                  <p className="text-center text-[10px] tracking-[0.25em] uppercase text-taupe mt-3">Ticket de réservation</p>
                  <p className="text-center font-mono text-sm font-bold mt-2">{ticketCode}</p>
                  <div className="border-t border-dashed border-sable my-4" />
                  <div className="space-y-2 text-sm">
                    <p><span className="text-taupe text-xs uppercase">Client</span><br />{formData.firstName} {formData.lastName}</p>
                    <p><span className="text-taupe text-xs uppercase">Téléphone</span><br />{formData.clientPhone}</p>
                    <p><span className="text-taupe text-xs uppercase">Prestation</span><br />{formData.service}</p>
                    <p><span className="text-taupe text-xs uppercase">Prix</span><br />{prixDemande()}</p>
                    <p><span className="text-taupe text-xs uppercase">Quand</span><br />{formData.date} à {formData.time}</p>
                    <p><span className="text-taupe text-xs uppercase">Espace</span><br />{formData.space === 'VIP' ? 'Suite VIP' : 'Standard'}</p>
                  </div>
                  <div className="border-t border-dashed border-sable my-4" />
                  <p className="text-center text-[10px] text-taupe uppercase tracking-wider">Haie Vive, Cotonou · À présenter à l'accueil</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button type="button" onClick={downloadTicket} className="flex-1 bg-bordeaux text-white py-3 rounded-full text-xs font-bold uppercase">Télécharger le ticket</button>
                  {imageTicket && <a href={imageTicket} download={"Ticket-FOUSS-" + ticketCode + ".png"} className="sm:col-span-2 text-center text-sm font-bold text-bordeaux underline">Enregistrer le ticket</a>}
                  {messageTicket && <p className="sm:col-span-2 text-xs text-warm-brown">{messageTicket}</p>}
                  <button type="button" onClick={() => { setBookingStatus('idle'); setCurrentStep(1); setTicketCode(''); setFormData({ service: '', date: '', time: '10:00', space: 'Standard', firstName: '', lastName: '', clientPhone: '' }); }} className="flex-1 border border-sable py-3 rounded-full text-xs font-semibold">Nouvelle demande</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-6">
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                  {['1. Prestation', '2. Date', '3. Coordonnées'].map((label, index) => (
                    <div key={label} className={`py-2 rounded-full ${currentStep === index + 1 ? 'bg-bordeaux text-white' : 'bg-creme text-taupe'}`}>{label}</div>
                  ))}
                </div>

                {currentStep > 1 && (
                  <p className="text-xs text-warm-brown bg-creme rounded-xl px-3 py-2">
                    {formData.service || 'Prestation non choisie'} · {formData.space === 'VIP' ? 'Suite VIP' : 'Standard'}
                    {formData.date ? ` · ${formData.date} à ${formData.time}` : ''}
                  </p>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold">Prestation</p>
                    <p className="text-sm text-warm-brown">Allez dans Tarifs et Services, choisissez coiffure femme, coiffure homme ou coiffure enfant, puis appuyez sur Réserver.</p>
                    <Link to="/tarifs" className="inline-flex text-sm font-bold text-bordeaux">Ouvrir Tarifs et Services</Link>
                    {formData.service && <p className="rounded-2xl border border-bordeaux bg-creme px-4 py-3 text-sm font-semibold">{formData.service}</p>}
                    <p className="text-sm font-semibold pt-2">Où ?</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setFormData({ ...formData, space: 'Standard' })} className={`border rounded-2xl p-3 text-left ${formData.space === 'Standard' ? 'border-bordeaux bg-creme' : 'border-sable'}`}>
                        <span className="block text-sm font-bold">Standard</span>
                        <span className="block text-xs text-taupe mt-1">Cabine classique, prix affiché</span>
                      </button>
                      <button type="button" onClick={() => setFormData({ ...formData, space: 'VIP' })} className={`border rounded-2xl p-3 text-left ${formData.space === 'VIP' ? 'border-bordeaux bg-creme' : 'border-sable'}`}>
                        <span className="block text-sm font-bold text-bordeaux">Suite VIP</span>
                        <span className="block text-xs text-taupe mt-1">Cabine privée, +5 000 FCFA</span>
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-warm-brown mb-2">Jour</label>
                      <input required type="date" min={new Date().toISOString().split('T')[0]} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full border border-sable rounded-2xl px-4 py-3 text-sm bg-white text-charcoal" />
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs font-bold uppercase text-warm-brown mb-2">Heure</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(h => (
                          <button key={h} type="button" onClick={() => setFormData({ ...formData, time: h })} className={`rounded-full py-2 text-sm font-semibold ${formData.time === h ? 'bg-bordeaux text-white' : 'bg-white border border-sable'}`}>{h}</button>
                        ))}
                      </div>
                    </div>
                    <p className="sm:col-span-2 text-xs text-taupe">Le salon est ouvert de 09h à 23h, du lundi au samedi. 13h n'est pas proposé.</p>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold">Pour vous rappeler</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input required type="text" placeholder="Prénom" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="border border-sable rounded-xl px-4 py-3 text-sm" />
                      <input required type="text" placeholder="Nom" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="border border-sable rounded-xl px-4 py-3 text-sm" />
                    </div>
                    <input required type="tel" placeholder="Téléphone, exemple 57 98 50 73" value={formData.clientPhone} onChange={e => setFormData({ ...formData, clientPhone: e.target.value })} className="w-full border border-sable rounded-xl px-4 py-3 text-sm" />
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  {currentStep > 1 ? (
                    <button type="button" onClick={prevStep} className="text-xs font-semibold uppercase text-warm-brown">Retour</button>
                  ) : <span />}
                  {currentStep < 3 ? (
                    <button type="button" onClick={nextStep} className="bg-bordeaux text-white text-xs font-bold uppercase px-6 py-3 rounded-full">Suivant</button>
                  ) : (
                    <button type="submit" disabled={bookingStatus === 'loading'} className="bg-bordeaux text-white text-xs font-bold uppercase px-6 py-3 rounded-full">
                      {bookingStatus === 'loading' ? 'Envoi...' : 'Envoyer ma demande'}
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
