import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

// --- DATA ---
const services = {
  femme: [
    { name: 'Tresses Africaines', price: '15 000 FCFA', duration: '2h - 4h' },
    { name: 'Tissage & Perruque', price: '20 000 FCFA', duration: '2h' },
    { name: 'Soin Profond Nappy', price: '10 000 FCFA', duration: '1h' },
  ],
  homme: [
    { name: 'Coupe Dégradé', price: '3 000 FCFA', duration: '30 min' },
    { name: 'Taille de Barbe', price: '2 000 FCFA', duration: '20 min' },
    { name: 'Forfait VIP Homme', price: '10 000 FCFA', duration: '1h' },
  ]
};

const gallery = [
  '/Images/homme1.jpg',
  '/Images/homme2.jpg',
  '/Images/homme3.jpg',
  '/Images/femme2.jpg',
  '/Images/enfant1.jpg',
  '/Images/enfant2.jpg',
];

const team = [
  { name: 'Soboure', role: 'Directeur & Expert', image: '/Images/expert1.jpg' },
  { name: 'Ibrahim', role: 'Maître Barbier', image: '/Images/expert2.jpg' },
  { name: 'Fadel', role: 'Spécialiste Soins Nappy', image: '/Images/expert3.jpg' },
  { name: 'Kader', role: 'Coiffeur Visagiste', image: '/Images/expert4.jpg' },
];

export default function MainSite() {
  const [activeTab, setActiveTab] = useState<'femme' | 'homme'>('femme');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  
  // Form state
  const [formData, setFormData] = useState({
    service: '', date: '', time: '10:00', space: 'Standard', firstName: '', lastName: '', clientPhone: ''
  });

  const ticketRef = useRef<HTMLDivElement>(null);

  const downloadTicket = async () => {
    if (ticketRef.current) {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#F8F7F4'
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Ticket_Fouss_Coiffure_${formData.firstName}_${formData.lastName}.png`;
      link.click();
    }
  };

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
      }
    } catch (err) {
      console.error(err);
      setBookingStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#2A2A2A] font-sans">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-[#F8F7F4]/90 backdrop-blur-md border-b border-[#E5E3DC] py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex flex-col items-center justify-center cursor-pointer" onClick={() => scrollTo('home')}>
            <span className="font-display text-3xl font-black tracking-tight text-[#2A2A2A] leading-none">FOUSS</span>
            <span className="font-sans text-[0.6rem] tracking-[0.3em] text-[#8C7A6B] uppercase font-medium mt-1">Coiffure</span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => scrollTo('home')} className="text-sm font-medium text-[#6B6358] hover:text-[#8C7A6B]">Accueil</button>
            <Link to="/tarifs" className="text-sm font-medium text-[#6B6358] hover:text-[#8C7A6B]">Tarifs</Link>
            <Link to="/galerie" className="text-sm font-medium text-[#6B6358] hover:text-[#8C7A6B]">Galerie</Link>
            <button onClick={() => scrollTo('team')} className="text-sm font-medium text-[#6B6358] hover:text-[#8C7A6B]">L'Équipe</button>
            <button onClick={() => scrollTo('booking')} className="bg-[#8C7A6B] text-white px-6 py-2 rounded-full text-sm hover:bg-[#736356]">Réserver</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Video Background */}
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
          {/* Overlays for readability and blending with the page */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F7F4] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
            L'Excellence <br/><span className="italic font-light text-[#D4AF37]">à votre mesure</span>
          </h1>
          <p className="text-lg text-white/90 mb-10 drop-shadow-md">Le salon de référence à Cotonou. Espace Standard & Suite VIP.</p>
          <button onClick={() => scrollTo('booking')} className="bg-[#D4AF37] text-[#2A2A2A] px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-white transition-colors shadow-xl hover:scale-105 transform duration-300">
            Prendre Rendez-vous
          </button>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-[#4A4238] text-center mb-12">Nos Réalisations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {gallery.map((img, i) => (
              <div key={i} className="aspect-[4/5] overflow-hidden rounded-2xl">
                <img src={img} alt="Coiffure" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/galerie" className="inline-flex items-center text-[#8C7A6B] font-medium hover:underline group">
              Voir toute la galerie
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-20 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-[#4A4238]">Nos Experts</h2>
            <p className="text-[#6B6358] mt-4">Le savoir-faire à votre service</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative overflow-hidden aspect-[3/4] mb-6 rounded-2xl">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#4A4238] mb-1">{member.name}</h3>
                <p className="text-sm text-[#8C7A6B] uppercase tracking-wider">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="py-20 bg-[#F8F7F4]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-[#E5E3DC]">
            <h2 className="text-3xl font-serif font-bold text-[#4A4238] mb-8 text-center">Réserver un moment</h2>
            
            {bookingStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="bg-[#F8F7F4] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-[#8C7A6B]" size={40} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#4A4238] mb-2">Réservation Confirmée !</h3>
                <p className="text-[#6B6358] mb-8">
                  Merci pour votre confiance. Veuillez télécharger votre ticket à présenter le jour de votre rendez-vous.
                </p>
                
                {/* Ticket to download */}
                <div className="flex justify-center mb-8">
                  <div 
                    ref={ticketRef} 
                    className="bg-white border-2 border-[#8C7A6B] border-dashed rounded-2xl p-8 max-w-sm w-full text-left relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#8C7A6B]"></div>
                    <div className="text-center border-b border-[#E5E3DC] pb-4 mb-4">
                      <div className="flex flex-col items-center justify-center mb-2">
                        <span className="font-display text-2xl font-black tracking-tight text-[#2A2A2A] leading-none">FOUSS</span>
                        <span className="font-sans text-[0.5rem] tracking-[0.3em] text-[#8C7A6B] uppercase font-medium mt-1">Coiffure</span>
                      </div>
                      <p className="text-xs text-[#6B6358] uppercase tracking-widest mt-1">Ticket de Réservation</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-[#8C7A6B] uppercase">Nom & Prénom</p>
                        <p className="font-medium text-[#4A4238]">{formData.lastName} {formData.firstName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#8C7A6B] uppercase">Prestation</p>
                        <p className="font-medium text-[#4A4238]">{formData.service}</p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs text-[#8C7A6B] uppercase">Date</p>
                          <p className="font-medium text-[#4A4238]">{formData.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[#8C7A6B] uppercase">Heure</p>
                          <p className="font-medium text-[#4A4238]">{formData.time}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-[#E5E3DC] text-center">
                      <p className="text-xs text-[#6B6358] italic">À présenter lors de votre arrivée au salon.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    onClick={downloadTicket}
                    className="flex items-center justify-center gap-2 bg-[#4A4238] text-white px-8 py-3 rounded-full font-medium hover:bg-[#2A2A2A] transition-colors"
                  >
                    <Download size={20} />
                    Télécharger le ticket
                  </button>
                  <button 
                    onClick={() => {
                      setBookingStatus('idle');
                      setFormData({ service: '', date: '', time: '10:00', space: 'Standard', firstName: '', lastName: '', clientPhone: '' });
                    }}
                    className="bg-transparent border border-[#8C7A6B] text-[#8C7A6B] px-8 py-3 rounded-full font-medium hover:bg-[#F8F7F4] transition-colors"
                  >
                    Nouveau rendez-vous
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#6B6358] mb-2">Nom</label>
                    <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border border-[#E5E3DC] rounded-xl px-4 py-3 bg-[#F8F7F4]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B6358] mb-2">Prénom</label>
                    <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border border-[#E5E3DC] rounded-xl px-4 py-3 bg-[#F8F7F4]" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#6B6358] mb-2">Téléphone</label>
                    <input required type="tel" value={formData.clientPhone} onChange={e => setFormData({...formData, clientPhone: e.target.value})} className="w-full border border-[#E5E3DC] rounded-xl px-4 py-3 bg-[#F8F7F4]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B6358] mb-2">Prestation</label>
                    <select required value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="w-full border border-[#E5E3DC] rounded-xl px-4 py-3 bg-[#F8F7F4]">
                      <option value="">Choisir...</option>
                      <option value="Tresses Africaines">Tresses Africaines</option>
                      <option value="Coupe Dégradé">Coupe Dégradé</option>
                      <option value="Soin Nappy">Soin Nappy</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#6B6358] mb-2">Date</label>
                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-[#E5E3DC] rounded-xl px-4 py-3 bg-[#F8F7F4]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B6358] mb-2">Heure</label>
                    <select value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full border border-[#E5E3DC] rounded-xl px-4 py-3 bg-[#F8F7F4]">
                      <option>10:00</option>
                      <option>14:00</option>
                      <option>16:00</option>
                    </select>
                  </div>
                </div>

                <button disabled={bookingStatus === 'loading'} type="submit" className="w-full bg-[#8C7A6B] text-white py-4 rounded-xl font-medium hover:bg-[#736356] transition-colors">
                  {bookingStatus === 'loading' ? 'En cours...' : 'Confirmer la réservation'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2A2A] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center justify-center mb-6">
            <span className="font-display text-3xl font-black tracking-tight text-white leading-none">FOUSS</span>
            <span className="font-sans text-[0.6rem] tracking-[0.3em] text-[#8C7A6B] uppercase font-medium mt-1">Coiffure</span>
          </div>
          <p className="text-[#8C7A6B] mb-6">Le salon de référence à Cotonou.</p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mb-8 text-sm">
            <a href="https://wa.me/22957985073" target="_blank" rel="noopener noreferrer" className="hover:text-[#8C7A6B] transition-colors flex items-center">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="mr-2">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp: +229 57 98 50 73
            </a>
            <span className="hidden md:inline text-[#6B6358]">|</span>
            <span className="text-[#E5E3DC]">Ouvert du Lundi au Samedi, 9h - 20h</span>
          </div>
          <p className="text-xs text-[#6B6358]">© {new Date().getFullYear()} Fouss Coiffure. Tous droits réservés.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/22957985073"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all hover:scale-110 z-50 flex items-center justify-center group"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}
