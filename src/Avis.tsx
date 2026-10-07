// Avis clients sur l'accueil.
// Les cartes viennent de GET /api/avis, seulement les avis publiés.
// Le formulaire n'est pas affiché en permanence : le bouton flottant envoie vers #donner-avis.

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';

type AvisClient = {
  id: number;
  nom: string;
  prestation: string;
  note: number;
  texte: string;
};

export default function Avis() {
  const { hash } = useLocation();
  const formulaireOuvert = hash === '#donner-avis';
  const [avis, setAvis] = useState<AvisClient[]>([]);
  const [nom, setNom] = useState('');
  const [prestation, setPrestation] = useState('');
  const [note, setNote] = useState(5);
  const [texte, setTexte] = useState('');
  const [message, setMessage] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    fetch('/api/avis')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setAvis(data); })
      .catch(() => setAvis([]));
  }, []);

  useEffect(() => {
    if (!formulaireOuvert) return;
    document.getElementById('donner-avis')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [formulaireOuvert]);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setMessage('');
    try {
      const res = await fetch('/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prestation, note, texte }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Envoi impossible');
      setNom('');
      setPrestation('');
      setTexte('');
      setNote(5);
      setMessage('Merci. Le salon lit l\'avis avant de l\'afficher.');
    } catch (err: any) {
      setMessage(err.message || 'Envoi impossible');
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <section id="avis" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">Avis clients</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {avis.map((item) => (
            <article key={item.id} className="bg-creme border border-sable rounded-3xl p-5">
              <div className="flex gap-1 text-bordeaux" aria-label={`${item.note} sur 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={14} fill={i < item.note ? 'currentColor' : 'none'} />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-charcoal">« {item.texte} »</p>
            </article>
          ))}
        </div>

        {formulaireOuvert && (
          <form id="donner-avis" onSubmit={envoyer} className="mt-10 max-w-xl mx-auto bg-creme border border-sable rounded-3xl p-5 space-y-3">
            <p className="font-semibold">Donner votre avis</p>
            <input value={nom} onChange={(e) => setNom(e.target.value)} required placeholder="Prénom" className="w-full border border-sable rounded-xl px-4 py-3 text-sm bg-white" />
            <input value={prestation} onChange={(e) => setPrestation(e.target.value)} required placeholder="Prestation" className="w-full border border-sable rounded-xl px-4 py-3 text-sm bg-white" />
            <label className="block text-xs text-taupe">
              Note
              <select value={note} onChange={(e) => setNote(Number(e.target.value))} className="mt-1 w-full border border-sable rounded-xl px-4 py-3 text-sm bg-white text-charcoal">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} / 5</option>)}
              </select>
            </label>
            <textarea value={texte} onChange={(e) => setTexte(e.target.value)} required maxLength={600} placeholder="Votre avis" className="w-full border border-sable rounded-xl px-4 py-3 text-sm bg-white min-h-28" />
            <button disabled={envoi} className="bg-bordeaux text-white rounded-full px-5 py-3 text-sm font-semibold">
              {envoi ? 'Envoi...' : 'Envoyer mon avis'}
            </button>
            {message && <p className="text-sm text-warm-brown">{message}</p>}
          </form>
        )}
      </div>

      {!formulaireOuvert && (
        <Link
          to="/#donner-avis"
          className="fixed bottom-6 right-6 z-40 rounded-full bg-bordeaux text-white px-5 py-3 text-sm font-semibold shadow-lg"
        >
          Donner votre avis
        </Link>
      )}
    </section>
  );
}
