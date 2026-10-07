// Avis clients sur l'accueil.
// La photo est facultative. Elle est réduite dans le navigateur avant l'envoi.

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';

type AvisClient = {
  id: number;
  nom: string;
  prestation: string;
  note: number;
  texte: string;
  photo?: string;
};

function reduirePhoto(fichier: File) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(fichier);
    image.onload = () => {
      const max = 900;
      const ratio = Math.min(1, max / Math.max(image.width, image.height));
      const toile = document.createElement('canvas');
      toile.width = Math.round(image.width * ratio);
      toile.height = Math.round(image.height * ratio);
      const crayon = toile.getContext('2d');
      if (!crayon) {
        reject(new Error('Photo illisible'));
        return;
      }
      crayon.drawImage(image, 0, 0, toile.width, toile.height);
      URL.revokeObjectURL(url);
      resolve(toile.toDataURL('image/jpeg', 0.72));
    };
    image.onerror = () => reject(new Error('Photo illisible'));
    image.src = url;
  });
}

export default function Avis() {
  const { hash } = useLocation();
  const formulaireOuvert = hash === '#donner-avis';
  const [avis, setAvis] = useState<AvisClient[]>([]);
  const [nom, setNom] = useState('');
  const [prestation, setPrestation] = useState('');
  const [note, setNote] = useState(5);
  const [texte, setTexte] = useState('');
  const [photo, setPhoto] = useState('');
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

  async function choisirPhoto(fichier?: File) {
    if (!fichier) {
      setPhoto('');
      return;
    }
    const reduite = await reduirePhoto(fichier);
    if (reduite.length > 500000) {
      setMessage('Photo trop lourde. Choisis une image plus petite.');
      setPhoto('');
      return;
    }
    setMessage('');
    setPhoto(reduite);
  }

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setMessage('');
    try {
      const res = await fetch('/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prestation, note, texte, photo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Envoi impossible');
      setNom('');
      setPrestation('');
      setTexte('');
      setPhoto('');
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
              {item.photo && <img src={item.photo} alt="" className="w-full h-44 object-cover rounded-2xl mb-3" />}
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
            <label className="block text-xs text-taupe">
              Photo de la coiffure, facultative
              <input type="file" accept="image/*" onChange={(e) => choisirPhoto(e.target.files?.[0])} className="mt-1 block w-full text-sm" />
            </label>
            {photo && <img src={photo} alt="Aperçu" className="w-full h-40 object-cover rounded-2xl" />}
            <button disabled={envoi} className="bg-bordeaux text-white rounded-full px-5 py-3 text-sm font-semibold">
              {envoi ? 'Envoi...' : 'Envoyer mon avis'}
            </button>
            {message && <p className="text-sm text-warm-brown">{message}</p>}
          </form>
        )}
      </div>

      {!formulaireOuvert && (
        <Link to="/#donner-avis" className="fixed bottom-6 right-6 z-40 rounded-full bg-bordeaux text-white px-5 py-3 text-sm font-semibold shadow-lg">
          Donner votre avis
        </Link>
      )}
    </section>
  );
}
