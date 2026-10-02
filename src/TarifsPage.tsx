// Rôle de ce fichier : la page des prix.
// Coiffure se divise en Femme, Homme et Enfant. Enfant n'a pas encore de prix.
// Réserver ouvre le formulaire de l'accueil. La prestation n'est pas encore préremplie.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Sparkles, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import { serviceCategories, type Service } from './data/services';

const onglets = [
  { id: 'coiffure', label: 'Coiffure' },
  { id: 'soins', label: 'Soins' },
  { id: 'boutique', label: 'Showroom' },
  { id: 'vip', label: 'VIP' },
] as const;

const publics = ['Femme', 'Homme', 'Enfant'] as const;

const coiffureFemme = ['tresses', 'tissage', 'nappy'];
const coiffureHomme = ['degrade', 'barbe'];

function prestationsCoiffure(publicCible: (typeof publics)[number]): Service[] {
  if (publicCible === 'Enfant') return [];
  const ids = publicCible === 'Femme' ? coiffureFemme : coiffureHomme;
  return serviceCategories.coiffure.filter((service) => ids.includes(service.id));
}

export default function TarifsPage() {
  const [onglet, setOnglet] = useState<(typeof onglets)[number]['id']>('coiffure');
  const [publicCible, setPublicCible] = useState<(typeof publics)[number]>('Femme');

  const cartes = onglet === 'coiffure'
    ? prestationsCoiffure(publicCible)
    : serviceCategories[onglet];

  return (
    <div className="min-h-screen bg-creme text-charcoal font-sans">
      <Navbar />

      <section className="relative py-20 bg-charcoal text-white overflow-hidden mt-[73px]">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-gold-light text-xs font-bold tracking-widest uppercase">Notre catalogue</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2">Tarifs & Prestations</h1>
          <p className="text-creme/80 text-sm md:text-base mt-4 max-w-xl leading-relaxed font-light">
            Les prix affichés sont ceux du salon. Réserver ouvre le formulaire, la prestation se choisit encore à l'étape 1.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-center mb-6 overflow-x-auto pb-2">
          <div className="bg-white p-1.5 rounded-full border border-sable flex space-x-1 shrink-0">
            {onglets.map((item) => (
              <button
                key={item.id}
                onClick={() => setOnglet(item.id)}
                className={`px-6 py-3 rounded-full text-xs md:text-sm font-semibold ${
                  onglet === item.id ? 'bg-bordeaux text-white' : 'text-warm-brown hover:bg-creme'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {onglet === 'coiffure' && (
          <div className="flex justify-center mb-10">
            <div className="flex gap-6 text-sm font-semibold border-b border-sable">
              {publics.map((nom) => (
                <button
                  key={nom}
                  onClick={() => setPublicCible(nom)}
                  className={`pb-2 ${publicCible === nom ? 'text-bordeaux border-b-2 border-bordeaux' : 'text-taupe'}`}
                >
                  {nom}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${onglet}-${publicCible}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {cartes.length === 0 ? (
              <p className="text-warm-brown md:col-span-3">Les tarifs de cette section seront ajoutés ici.</p>
            ) : cartes.map((service) => (
              <article key={service.id} className="bg-white p-6 rounded-2xl border border-sable flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold">{service.name}</h3>
                  <p className="text-warm-brown text-sm leading-relaxed mt-3">{service.desc}</p>
                </div>
                <div className="mt-6">
                  <p className="text-bordeaux text-2xl font-serif font-bold">{service.price}</p>
                  <p className="text-xs text-taupe mt-2 flex items-center gap-1.5">
                    <Clock size={14} />
                    {service.duration}
                  </p>
                  <Link
                    to="/#booking"
                    className="mt-5 inline-flex items-center justify-center bg-bordeaux text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider"
                  >
                    Réserver
                  </Link>
                </div>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>

        <section className="bg-bordeaux text-white rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={14} />
            Suite VIP
          </div>
          <h2 className="text-3xl font-serif font-bold mt-3">L'option suite, +5 000 FCFA</h2>
          <p className="text-white/85 text-sm mt-4 max-w-2xl leading-relaxed">
            La suite s'ajoute à une prestation, ou se réserve avec le Rituel Beauté et le Forfait Mariage. Le choix Standard ou Suite VIP se fait dans le formulaire.
          </p>
          <Link to="/#booking" className="mt-6 inline-flex items-center gap-2 bg-white text-charcoal px-6 py-3 rounded-full text-xs font-bold uppercase">
            <Calendar size={14} />
            Réserver
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
