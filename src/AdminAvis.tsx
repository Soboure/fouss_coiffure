// Modération des avis. Le jeton admin est celui déjà utilisé pour les réservations.
// Publier passe le statut à Publié. Masquer le remet en attente.

import { useEffect, useState } from 'react';

type AvisAdmin = {
  id: number;
  nom: string;
  prestation: string;
  note: number;
  texte: string;
  photo?: string;
  status?: string;
};

export default function AdminAvis({ token }: { token: string }) {
  const [avis, setAvis] = useState<AvisAdmin[]>([]);

  function charger() {
    fetch('/api/avis/moderation', { headers: { 'X-Admin-Token': token } })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setAvis(data); })
      .catch(() => setAvis([]));
  }

  useEffect(() => { charger(); }, [token]);

  async function changer(id: number, status: string) {
    await fetch(`/api/avis/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token },
      body: JSON.stringify({ status }),
    });
    charger();
  }

  return (
    <section className="bg-white border border-sable rounded-3xl p-5 mb-6">
      <h2 className="font-serif text-2xl">Avis à modérer</h2>
      <p className="text-xs text-taupe mt-1 mb-4">Un avis envoyé par le site reste caché tant qu'il n'est pas publié.</p>
      <div className="space-y-3">
        {avis.map((item) => (
          <article key={item.id} className="border border-sable rounded-2xl p-4">
            <div className="flex justify-between gap-3">
              <p className="font-semibold">{item.nom} · {item.prestation} · {item.note}/5</p>
              <span className="text-xs text-taupe">{item.status || 'En attente'}</span>
            </div>
            {item.photo && <img src={item.photo} alt="" className="mt-3 w-28 h-28 object-cover rounded-xl" />}
            <p className="text-sm mt-2">{item.texte}</p>
            <button
              onClick={() => changer(item.id, item.status === 'Publié' ? 'En attente' : 'Publié')}
              className="mt-3 text-xs font-bold bg-bordeaux text-white px-3 py-2 rounded-full"
            >
              {item.status === 'Publié' ? 'Masquer' : 'Publier'}
            </button>
          </article>
        ))}
        {avis.length === 0 && <p className="text-sm text-taupe">Aucun avis pour le moment.</p>}
      </div>
    </section>
  );
}
