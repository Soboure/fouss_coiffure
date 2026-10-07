// Avis clients, affichés sur l'accueil avant la réservation.
// Ce sont des exemples. Remplace le texte, le prénom et la prestation par de vrais retours.
// Pour en ajouter un : copie un objet dans la liste avis.

import { Star } from 'lucide-react';

const avis = [
  { nom: 'Amina', prestation: 'Tresses artistiques', note: 5, texte: 'Le rendu est net, et on m\'a expliqué comment les garder. Je reviendrai pour une cérémonie.' },
  { nom: 'Kodjo', prestation: 'Dégradé et barbe', note: 5, texte: 'Contours propres, sans attente interminable. Le créneau de 18h était respecté.' },
  { nom: 'Fatoumata', prestation: 'Soin nappy', note: 5, texte: 'Cheveux souples après le soin. La cabine est calme, on n\'est pas pressé.' },
  { nom: 'Sarah', prestation: 'Nattes collées', note: 4, texte: 'Très belle ligne. J\'aurais aimé une photo du dos avant de partir, sinon rien à dire.' },
  { nom: 'Ibrahim', prestation: 'Suite VIP', note: 5, texte: 'J\'ai pris la cabine privée pour une coupe avant un rendez-vous. Tranquille, et le thé était là.' },
  { nom: 'Mariam', prestation: 'Soin visage', note: 5, texte: 'Peau nette sans tirer. On m\'a dit quoi éviter les jours d\'après, c\'est ça que je retiens.' },
];

export default function Avis() {
  return (
    <section id="avis" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-gold-dark text-xs font-bold tracking-widest uppercase">Avis clients</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mt-2">Ils sont passés au salon</h2>
          <p className="text-warm-brown mt-3 max-w-md mx-auto text-sm leading-relaxed">
            Retours après une prestation. Le salon confirme chaque rendez-vous.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {avis.map((item) => (
            <article key={item.nom + item.prestation} className="bg-creme border border-sable rounded-3xl p-5">
              <div className="flex gap-1 text-bordeaux" aria-label={`${item.note} sur 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={14} fill={i < item.note ? 'currentColor' : 'none'} />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-charcoal">« {item.texte} »</p>
              <p className="mt-4 text-sm font-semibold">{item.nom}</p>
              <p className="text-xs text-taupe">{item.prestation}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
