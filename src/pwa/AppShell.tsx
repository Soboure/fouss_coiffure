// Écran d'accueil de l'application installée. Route /app.
// Rendu type maquette mobile : en-tête, carte hero, raccourcis, barre du bas.
// Les liens ouvrent les pages déjà en ligne. On ne recrée pas la réservation ici.

import { Link } from "react-router-dom";
import { CalendarClock, Scissors, Sparkles, UserRound } from "lucide-react";

const raccourcis = [
  { to: "/tarifs", label: "Femme", detail: "Tresses, soins", icon: Sparkles },
  { to: "/tarifs", label: "Homme", detail: "Coupe, barbe", icon: UserRound },
  { to: "/galerie", label: "Galerie", detail: "Réalisations", icon: Scissors },
];

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#F7F3EF] text-[#2B211C] pb-28">
      <header className="bg-[#8C1913] text-white px-5 pt-8 pb-10 rounded-b-[28px]">
        <p className="text-xs tracking-[0.18em] uppercase text-[#E7C8C6]">Cotonou · Haie Vive</p>
        <h1 className="mt-2 font-serif text-4xl leading-none">Fouss</h1>
        <p className="mt-2 text-sm text-[#F7F3EF]/80">Maison de beauté. Lundi–samedi, 9h–23h.</p>
      </header>

      <main className="px-5 -mt-6 space-y-4">
        <section className="bg-white border border-[#E7DDD6] rounded-3xl p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[#7A655E]">Prochain geste</p>
          <h2 className="mt-1 text-2xl font-serif">Prendre un rendez-vous</h2>
          <p className="mt-2 text-sm text-[#5C463F]">Trois étapes. Le salon confirme ensuite. Dimanche : événement VIP seulement.</p>
          <Link
            to="/#reservation"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#8C1913] text-white px-5 py-3 text-sm font-semibold"
          >
            <CalendarClock size={16} />
            Réserver
          </Link>
        </section>

        <section className="grid grid-cols-3 gap-3">
          {raccourcis.map((item) => (
            <Link key={item.label} to={item.to} className="bg-white border border-[#E7DDD6] rounded-2xl p-3">
              <item.icon size={18} className="text-[#8C1913]" />
              <p className="mt-3 text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-[#7A655E]">{item.detail}</p>
            </Link>
          ))}
        </section>
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-[#E7DDD6] px-6 py-3 flex justify-between">
        <Link to="/app" className="text-xs font-semibold text-[#8C1913]">Accueil</Link>
        <Link to="/tarifs" className="text-xs text-[#5C463F]">Tarifs</Link>
        <Link to="/galerie" className="text-xs text-[#5C463F]">Galerie</Link>
        <Link to="/#reservation" className="text-xs text-[#5C463F]">Réserver</Link>
      </nav>
    </div>
  );
}
