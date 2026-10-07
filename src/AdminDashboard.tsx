// Rôle de ce fichier : le tableau du salon, adresse /admin.
// Le mot de passe obtient un jeton, gardé dans le navigateur.
// Les filtres et le tri se font ici, sur la liste déjà chargée. L'API n'a pas changé.
// Dernier reçu = plus grand id, la fiche créée en dernier. Ce n'est pas la date du rendez-vous.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogOut, Search, ShieldAlert } from 'lucide-react';

type Reservation = {
  id: number;
  clientName?: string;
  clientname?: string;
  clientPhone?: string;
  clientphone?: string;
  service?: string;
  price?: string;
  date?: string;
  time?: string;
  space?: string;
  code?: string;
  source?: string;
  status?: string;
  createdAt?: string;
  createdat?: string;
};

type Statut = 'all' | 'pending' | 'confirmed';
type Jour = 'all' | 'today' | 'upcoming' | 'past';
type Espace = 'all' | 'Standard' | 'VIP';
type Source = 'all' | 'site' | 'app';
type Tri = 'recent' | 'ancien' | 'rdv' | 'rdv-loin';

function nom(res: Reservation) {
  return res.clientName || res.clientname || '—';
}

function telephone(res: Reservation) {
  return res.clientPhone || res.clientphone || '—';
}

function aujourdhui() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fouss_admin_token'));
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<Statut>('all');
  const [jour, setJour] = useState<Jour>('all');
  const [espace, setEspace] = useState<Espace>('all');
  const [source, setSource] = useState<Source>('all');
  const [tri, setTri] = useState<Tri>('recent');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReservations = () => {
    if (!token) return;
    fetch('/api/reservations', { headers: { 'X-Admin-Token': token } })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('fouss_admin_token');
          setToken(null);
          throw new Error('Session expirée');
        }
        return res.json();
      })
      .then(data => { if (Array.isArray(data)) setReservations(data); })
      .catch(err => console.error(err));
  };

  useEffect(() => { if (token) fetchReservations(); }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('fouss_admin_token', data.token);
        setToken(data.token);
      } else setError(data.error || 'Mot de passe incorrect');
    } catch {
      setError('Erreur de connexion avec le serveur');
    }
  };

  const updateStatus = async (id: number, status: string) => {
    if (!token) return;
    const res = await fetch(`/api/reservations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token },
      body: JSON.stringify({ status })
    });
    if (res.status === 401) { setToken(null); return; }
    if (res.ok) setReservations(reservations.map(r => r.id === id ? { ...r, status } : r));
  };

  const confirmed = reservations.filter(r => r.status === 'Confirmé').length;
  const pending = reservations.filter(r => r.status !== 'Confirmé').length;
  const today = aujourdhui();
  const derniere = [...reservations].sort((a, b) => b.id - a.id)[0];

  const visibles = reservations
    .filter(res => {
      if (filter === 'confirmed' && res.status !== 'Confirmé') return false;
      if (filter === 'pending' && res.status === 'Confirmé') return false;
      if (jour === 'today' && res.date !== today) return false;
      if (jour === 'upcoming' && (!res.date || res.date < today)) return false;
      if (jour === 'past' && (!res.date || res.date >= today)) return false;
      if (espace !== 'all' && (res.space || 'Standard') !== espace) return false;
      if (source !== 'all' && (res.source || 'site') !== source) return false;
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return [nom(res), telephone(res), res.service, res.code].some(v => (v || '').toLowerCase().includes(q));
    })
    .sort((a, b) => {
      if (tri === 'recent') return b.id - a.id;
      if (tri === 'ancien') return a.id - b.id;
      const cleA = `${a.date || ''} ${a.time || ''}`;
      const cleB = `${b.date || ''} ${b.time || ''}`;
      return tri === 'rdv' ? cleA.localeCompare(cleB) : cleB.localeCompare(cleA);
    });

  if (!token) {
    return (
      <div className="min-h-screen bg-creme flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-white border border-sable rounded-3xl p-8 w-full max-w-md">
          <div className="flex justify-center mb-4"><Lock className="text-bordeaux" /></div>
          <h1 className="text-center font-serif text-2xl font-bold">FOUSS Admin</h1>
          <p className="text-center text-xs text-taupe mt-1 mb-6">Le mot de passe reste sur le serveur.</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" required className="w-full border border-sable rounded-xl px-4 py-3 text-sm" />
          {error && <p className="text-red-600 text-xs mt-2 flex items-center gap-1"><ShieldAlert size={12} />{error}</p>}
          <button className="w-full mt-4 bg-bordeaux text-white font-bold py-3 rounded-full">Se connecter</button>
          <Link to="/" className="block text-center text-xs text-taupe mt-4">Retour au site</Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-creme text-charcoal">
      <header className="bg-charcoal text-white px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-serif text-2xl font-bold">FOUSS</p>
            <p className="text-xs text-white/70">Tableau des rendez-vous</p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="text-xs px-4 py-2 rounded-full border border-white/20">Voir le site</Link>
            <button onClick={() => { localStorage.removeItem('fouss_admin_token'); setToken(null); }} className="text-xs px-4 py-2 rounded-full bg-white text-charcoal inline-flex items-center gap-1"><LogOut size={14} /> Sortir</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[['Total', reservations.length], ['En attente', pending], ['Confirmées', confirmed]].map(([label, n]) => (
            <div key={String(label)} className="bg-white border border-sable rounded-2xl p-4">
              <p className="text-xs text-taupe uppercase">{label}</p>
              <p className="text-2xl font-serif font-bold mt-1">{n}</p>
            </div>
          ))}
        </div>

        {derniere && (
          <section className="bg-white border border-bordeaux rounded-3xl p-5 mb-6">
            <p className="text-xs uppercase tracking-wide text-bordeaux font-semibold">Dernière réservation reçue</p>
            <p className="mt-1 font-serif text-2xl">{nom(derniere)}</p>
            <p className="text-sm text-warm-brown mt-1">
              {derniere.service} · {derniere.date} à {derniere.time} · {derniere.space === 'VIP' ? 'Suite VIP' : 'Standard'}
            </p>
            <p className="text-xs text-taupe mt-1">Fiche n°{derniere.id} · {telephone(derniere)} · {derniere.status === 'Confirmé' ? 'Confirmé' : 'En attente'}</p>
          </section>
        )}

        <div className="flex flex-col gap-3 mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-taupe" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Nom, téléphone, prestation ou code" className="w-full bg-white border border-sable rounded-full pl-9 pr-4 py-2.5 text-sm" />
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {([['all', 'Tous'], ['pending', 'En attente'], ['confirmed', 'Confirmés']] as const).map(([id, label]) => (
              <button key={id} onClick={() => setFilter(id)} className={`px-4 py-2 rounded-full ${filter === id ? 'bg-bordeaux text-white' : 'bg-white border border-sable'}`}>{label}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {([['all', 'Toutes les dates'], ['today', "Aujourd'hui"], ['upcoming', 'À venir'], ['past', 'Passés']] as const).map(([id, label]) => (
              <button key={id} onClick={() => setJour(id)} className={`px-4 py-2 rounded-full ${jour === id ? 'bg-charcoal text-white' : 'bg-white border border-sable'}`}>{label}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={espace} onChange={e => setEspace(e.target.value as Espace)} className="bg-white border border-sable rounded-full px-4 py-2 text-xs font-semibold">
              <option value="all">Tous les espaces</option>
              <option value="Standard">Standard</option>
              <option value="VIP">Suite VIP</option>
            </select>
            <select value={source} onChange={e => setSource(e.target.value as Source)} className="bg-white border border-sable rounded-full px-4 py-2 text-xs font-semibold">
              <option value="all">Toutes les sources</option>
              <option value="site">Site</option>
              <option value="app">Application</option>
            </select>
            <select value={tri} onChange={e => setTri(e.target.value as Tri)} className="bg-white border border-sable rounded-full px-4 py-2 text-xs font-semibold">
              <option value="recent">Dernières reçues</option>
              <option value="ancien">Plus anciennes</option>
              <option value="rdv">Rendez-vous le plus proche</option>
              <option value="rdv-loin">Rendez-vous le plus lointain</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-sable rounded-3xl overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-taupe border-b border-sable">
              <tr>
                {['Client', 'Prestation', 'Prix', 'Quand', 'Code', 'Source', 'Statut', ''].map(h => <th key={h} className="p-4">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {visibles.map(res => (
                <tr key={res.id} className={`border-b border-sable/70 align-top ${derniere && res.id === derniere.id ? 'bg-creme' : ''}`}>
                  <td className="p-4">
                    <p className="font-semibold">{nom(res)}</p>
                    <p className="text-xs text-taupe">{telephone(res)}</p>
                  </td>
                  <td className="p-4">
                    <p>{res.service}</p>
                    <p className="text-xs text-taupe">{res.space === 'VIP' ? 'Suite VIP' : 'Standard'}</p>
                  </td>
                  <td className="p-4">{res.price || '—'}</td>
                  <td className="p-4">{res.date}<br /><span className="text-xs text-taupe">{res.time}</span></td>
                  <td className="p-4 font-mono text-xs">{res.code || '—'}</td>
                  <td className="p-4 capitalize">{res.source || 'site'}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${res.status === 'Confirmé' ? 'bg-green-100 text-green-800' : 'bg-creme text-bordeaux'}`}>
                      {res.status === 'Confirmé' ? 'Confirmé' : 'En attente'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-y-2">
                    <button onClick={() => updateStatus(res.id, res.status === 'Confirmé' ? 'En attente' : 'Confirmé')} className="block ml-auto text-xs font-bold bg-bordeaux text-white px-3 py-2 rounded-full">
                      {res.status === 'Confirmé' ? 'Remettre en attente' : 'Confirmer'}
                    </button>
                  </td>
                </tr>
              ))}
              {visibles.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-taupe">Aucune réservation pour ces filtres.</td></tr>}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
