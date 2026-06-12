import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogOut, Calendar, Users, CheckCircle, Clock, Search, ShieldAlert, Sparkles } from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
    }
  }, [isAuthenticated]);

  const fetchReservations = () => {
    fetch('/api/reservations')
      .then(res => res.json())
      .then(data => setReservations(data))
      .catch(err => console.error("Error fetching reservations:", err));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'fouss2024') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setReservations([]);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setReservations(reservations.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Stats calculation
  const totalBookings = reservations.length;
  const confirmedBookings = reservations.filter(r => r.status === 'Confirmé').length;
  const pendingBookings = reservations.filter(r => r.status === 'En attente' || !r.status).length;

  // Filtering logic
  const filteredReservations = reservations.filter(res => {
    // Status filter
    if (filter === 'confirmed' && res.status !== 'Confirmé') return false;
    if (filter === 'pending' && res.status === 'Confirmé') return false;

    // Search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const clientName = res.clientName ? res.clientName.toLowerCase() : '';
      const clientPhone = res.clientPhone ? res.clientPhone.toLowerCase() : '';
      const service = res.service ? res.service.toLowerCase() : '';
      return clientName.includes(query) || clientPhone.includes(query) || service.includes(query);
    }

    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-warm-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-900/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="bg-warm-850 p-8 md:p-10 rounded-3xl border border-warm-800 max-w-md w-full relative z-10 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-warm-800 p-4 rounded-full border border-warm-700 shadow-inner">
              <Lock className="text-gold-400" size={32} />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <div className="flex flex-col items-center justify-center mb-2">
              <span className="font-display text-2xl font-black tracking-tight text-white leading-none">FOUSS</span>
              <span className="font-sans text-[0.5rem] tracking-[0.3em] text-gold-500 uppercase font-semibold mt-1">Coiffure</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-white mt-4">Accès Securisé Administrateur</h1>
            <p className="text-warm-400 text-xs mt-1">Saisissez votre mot de passe pour gérer les réservations.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
                className="w-full border border-warm-700 rounded-xl px-4 py-3.5 bg-warm-900 text-white placeholder-warm-500 focus:outline-none focus:border-gold-500 text-sm transition-colors"
              />
              {error && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5">
                  <ShieldAlert size={12} />
                  <span>{error}</span>
                </p>
              )}
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-750 text-warm-900 font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95"
            >
              Se connecter
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-warm-400 hover:text-gold-400 hover:underline transition-colors">
              Retour au site public
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-950 text-white font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-warm-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-black tracking-tight text-white leading-none">FOUSS</span>
              <span className="font-sans text-[0.5rem] tracking-[0.3em] text-gold-500 uppercase font-semibold mt-1">Admin</span>
              <span className="bg-gold-500/10 text-gold-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-gold-500/20 ml-2 uppercase">
                Panel Actif
              </span>
            </div>
            <p className="text-warm-400 text-xs mt-1.5">Tableau de bord de gestion des demandes de rendez-vous.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="text-xs font-semibold text-warm-300 hover:text-white px-4 py-2 bg-warm-850 hover:bg-warm-800 rounded-xl border border-warm-800 transition-colors"
            >
              Voir le site
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-350 px-4 py-2 bg-red-950/20 hover:bg-red-950/40 rounded-xl border border-red-900/30 transition-colors"
            >
              <LogOut size={14} />
              <span>Déconnexion</span>
            </button>
          </div>
        </header>

        {/* Statistic Cards Widget */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Total */}
          <div className="bg-warm-850 p-6 rounded-3xl border border-warm-800 shadow-lg flex items-center justify-between group hover:border-warm-700 transition-colors">
            <div>
              <p className="text-xs text-warm-400 uppercase tracking-wider font-semibold">Total Réservations</p>
              <h3 className="text-3xl font-bold mt-2 font-serif text-white">{totalBookings}</h3>
            </div>
            <div className="bg-warm-800 p-3.5 rounded-2xl border border-warm-750 text-warm-300">
              <Calendar size={20} />
            </div>
          </div>

          {/* Card 2: Confirmed */}
          <div className="bg-warm-850 p-6 rounded-3xl border border-warm-800 shadow-lg flex items-center justify-between group hover:border-green-900/35 transition-colors">
            <div>
              <p className="text-xs text-warm-400 uppercase tracking-wider font-semibold">Confirmés</p>
              <h3 className="text-3xl font-bold mt-2 font-serif text-green-400">{confirmedBookings}</h3>
            </div>
            <div className="bg-green-950/30 p-3.5 rounded-2xl border border-green-900/20 text-green-400">
              <CheckCircle size={20} />
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="bg-warm-850 p-6 rounded-3xl border border-warm-800 shadow-lg flex items-center justify-between group hover:border-gold-900/35 transition-colors">
            <div>
              <p className="text-xs text-warm-400 uppercase tracking-wider font-semibold">En attente</p>
              <h3 className="text-3xl font-bold mt-2 font-serif text-gold-400">{pendingBookings}</h3>
            </div>
            <div className="bg-gold-950/20 p-3.5 rounded-2xl border border-gold-900/20 text-gold-400 animate-pulse">
              <Clock size={20} />
            </div>
          </div>
        </section>

        {/* Filters and Search controls */}
        <section className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-warm-850 p-4 rounded-2xl border border-warm-800 shadow-md">
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-warm-500 pointer-events-none">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Rechercher client, téléphone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-warm-900 border border-warm-750 rounded-xl text-sm focus:outline-none focus:border-gold-500 text-white placeholder-warm-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex bg-warm-900 p-1 rounded-xl border border-warm-750 w-full md:w-auto shrink-0 overflow-x-auto">
            <button 
              onClick={() => setFilter('all')}
              className={`flex-1 md:flex-none px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === 'all' ? 'bg-gold-500 text-warm-900 font-bold' : 'text-warm-400 hover:text-white'
              }`}
            >
              Tous ({totalBookings})
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`flex-1 md:flex-none px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === 'pending' ? 'bg-gold-500 text-warm-900 font-bold' : 'text-warm-400 hover:text-white'
              }`}
            >
              En attente ({pendingBookings})
            </button>
            <button 
              onClick={() => setFilter('confirmed')}
              className={`flex-1 md:flex-none px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === 'confirmed' ? 'bg-gold-500 text-warm-900 font-bold' : 'text-warm-400 hover:text-white'
              }`}
            >
              Confirmés ({confirmedBookings})
            </button>
          </div>
        </section>

        {/* Data Table */}
        <div className="bg-warm-850 rounded-3xl shadow-xl border border-warm-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-warm-900 border-b border-warm-800">
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-warm-400">Client / Contact</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-warm-400">Prestation</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-warm-400">Date & Heure</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-warm-400">Espace</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-warm-400">Statut</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-warm-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-800">
                {filteredReservations.map(res => (
                  <tr key={res.id} className="hover:bg-warm-800/40 transition-colors">
                    {/* Client Name & Phone */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-warm-800 w-9 h-9 rounded-full flex items-center justify-center border border-warm-700 text-gold-400 font-bold text-xs uppercase shadow-inner">
                          {res.clientName ? res.clientName.substring(0,2) : 'CL'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-white">{res.clientName}</p>
                          <p className="text-xs text-warm-400 mt-0.5">{res.clientPhone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="p-5">
                      <p className="text-sm font-medium text-warm-200">{res.service}</p>
                    </td>

                    {/* Date / Time */}
                    <td className="p-5 text-sm text-warm-300">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{res.date}</span>
                        <span className="text-xs text-warm-400 flex items-center gap-1">
                          <Clock size={12} className="text-gold-500" />
                          {res.time}
                        </span>
                      </div>
                    </td>

                    {/* Space */}
                    <td className="p-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        res.space === 'VIP' 
                          ? 'bg-gold-500/10 text-gold-400 border-gold-500/20' 
                          : 'bg-warm-800 text-warm-400 border-warm-750'
                      }`}>
                        {res.space === 'VIP' ? 'SUITE VIP' : 'Standard'}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="p-5">
                      {res.status === 'Confirmé' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                          Confirmé
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gold-500/10 text-gold-400 border border-gold-500/20 inline-flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                          En attente
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-5 text-right">
                      {res.status !== 'Confirmé' ? (
                        <button 
                          onClick={() => updateStatus(res.id, 'Confirmé')} 
                          className="text-xs font-bold text-warm-900 bg-gold-500 hover:bg-gold-400 px-4 py-2 rounded-xl transition-all shadow-md hover:scale-105 active:scale-95"
                        >
                          Confirmer
                        </button>
                      ) : (
                        <button 
                          onClick={() => updateStatus(res.id, 'En attente')} 
                          className="text-xs font-semibold text-warm-400 hover:text-white px-4 py-2 hover:bg-warm-900 rounded-xl transition-all"
                        >
                          Remettre en attente
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                
                {filteredReservations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-warm-500 text-sm">
                      Aucune réservation trouvée correspondant aux critères.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
