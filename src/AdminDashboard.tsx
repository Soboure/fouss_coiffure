import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogOut, Calendar, Clock, Search, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';

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
    if (filter === 'confirmed' && res.status !== 'Confirmé') return false;
    if (filter === 'pending' && res.status === 'Confirmé') return false;

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
      <div className="min-h-screen bg-[#1C1B19] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#C9A84C]/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="bg-[#2C2B28] p-8 md:p-10 rounded-3xl border border-white/5 max-w-md w-full relative z-10 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-[#1C1B19] p-4 rounded-full border border-white/5 shadow-inner">
              <Lock className="text-[#C9A84C]" size={32} />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <div className="flex flex-col items-center justify-center mb-2">
              <span className="font-display text-2xl font-black tracking-tight text-white leading-none">FOUSS</span>
              <span className="font-sans text-[0.5rem] tracking-[0.3em] text-[#C9A84C] uppercase font-semibold mt-1">Maison de Beauté</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-white mt-4">Accès Administrateur</h1>
            <p className="text-white/60 text-xs mt-1">Saisissez votre mot de passe pour gérer les rendez-vous.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
                className="w-full border border-white/10 rounded-xl px-4 py-3.5 bg-[#1C1B19] text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C] text-sm transition-colors"
              />
              {error && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5 font-semibold">
                  <ShieldAlert size={12} />
                  <span>{error}</span>
                </p>
              )}
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#C9A84C] hover:bg-[#7A5F1A] text-[#2C2B28] hover:text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95"
            >
              Se connecter
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-white/50 hover:text-[#C9A84C] hover:underline transition-colors">
              Retour au site public
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1B19] text-white font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-black tracking-tight text-white leading-none">FOUSS</span>
              <span className="font-sans text-[0.5rem] tracking-[0.3em] text-[#C9A84C] uppercase font-semibold mt-1">Admin</span>
              <span className="bg-[#C9A84C]/10 text-[#C9A84C] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#C9A84C]/25 ml-2 uppercase">
                Panel Actif
              </span>
            </div>
            <p className="text-white/60 text-xs mt-1.5">Tableau de bord de gestion des prestations et réservations.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="text-xs font-semibold text-white/80 hover:text-white px-4 py-2.5 bg-[#2C2B28] hover:bg-[#383632] rounded-xl border border-white/5 transition-colors"
            >
              Voir le site
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 px-4 py-2.5 bg-red-950/20 hover:bg-red-950/40 rounded-xl border border-red-900/30 transition-colors"
            >
              <LogOut size={14} />
              <span>Déconnexion</span>
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#2C2B28] p-6 rounded-3xl border border-white/5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">Total Demandes</p>
              <h3 className="text-3xl font-bold mt-2 font-serif text-white">{totalBookings}</h3>
            </div>
            <div className="bg-[#1C1B19] p-3.5 rounded-2xl border border-white/5 text-white/70">
              <Calendar size={20} />
            </div>
          </div>

          <div className="bg-[#2C2B28] p-6 rounded-3xl border border-white/5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">Confirmées</p>
              <h3 className="text-3xl font-bold mt-2 font-serif text-green-400">{confirmedBookings}</h3>
            </div>
            <div className="bg-green-950/30 p-3.5 rounded-2xl border border-green-900/20 text-green-400">
              <CheckCircle size={20} />
            </div>
          </div>

          <div className="bg-[#2C2B28] p-6 rounded-3xl border border-white/5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">En attente</p>
              <h3 className="text-3xl font-bold mt-2 font-serif text-[#C9A84C]">{pendingBookings}</h3>
            </div>
            <div className="bg-[#C9A84C]/10 p-3.5 rounded-2xl border border-[#C9A84C]/20 text-[#C9A84C] animate-pulse">
              <Clock size={20} />
            </div>
          </div>
        </section>

        {/* Filters bar */}
        <section className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-[#2C2B28] p-4 rounded-2xl border border-white/5 shadow-md">
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/40 pointer-events-none">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Rechercher client, téléphone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1C1B19] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#C9A84C] text-white placeholder-white/30"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex bg-[#1C1B19] p-1 rounded-xl border border-white/10 w-full md:w-auto shrink-0 overflow-x-auto">
            <button 
              onClick={() => setFilter('all')}
              className={`flex-1 md:flex-none px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === 'all' ? 'bg-[#C9A84C] text-[#2C2B28] font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              Tous ({totalBookings})
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`flex-1 md:flex-none px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === 'pending' ? 'bg-[#C9A84C] text-[#2C2B28] font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              En attente ({pendingBookings})
            </button>
            <button 
              onClick={() => setFilter('confirmed')}
              className={`flex-1 md:flex-none px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                filter === 'confirmed' ? 'bg-[#C9A84C] text-[#2C2B28] font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              Confirmés ({confirmedBookings})
            </button>
          </div>
        </section>

        {/* Data Table */}
        <div className="bg-[#2C2B28] rounded-3xl shadow-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1C1B19] border-b border-white/5">
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-white/50">Client / Contact</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-white/50">Prestation</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-white/50">Date & Heure</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-white/50">Espace</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-white/50">Statut</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-white/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredReservations.map(res => (
                  <tr key={res.id} className="hover:bg-white/5 transition-colors">
                    {/* Client Name & Phone */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#1C1B19] w-9 h-9 rounded-full flex items-center justify-center border border-white/10 text-[#C9A84C] font-bold text-xs uppercase shadow-inner">
                          {res.clientName ? res.clientName.substring(0,2) : 'CL'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-white">{res.clientName}</p>
                          <p className="text-xs text-white/40 mt-0.5">{res.clientPhone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="p-5">
                      <p className="text-sm font-medium text-white/90">{res.service}</p>
                    </td>

                    {/* Date / Time */}
                    <td className="p-5 text-sm text-white/80">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{res.date}</span>
                        <span className="text-xs text-white/40 flex items-center gap-1">
                          <Clock size={12} className="text-[#C9A84C]" />
                          {res.time}
                        </span>
                      </div>
                    </td>

                    {/* Space */}
                    <td className="p-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        res.space === 'VIP' 
                          ? 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20' 
                          : 'bg-[#1C1B19] text-white/50 border-white/5'
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
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
                          En attente
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-5 text-right">
                      {res.status !== 'Confirmé' ? (
                        <button 
                          onClick={() => updateStatus(res.id, 'Confirmé')} 
                          className="text-xs font-bold text-[#2C2B28] bg-[#C9A84C] hover:bg-[#7A5F1A] hover:text-white px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
                        >
                          Confirmer
                        </button>
                      ) : (
                        <button 
                          onClick={() => updateStatus(res.id, 'En attente')} 
                          className="text-xs font-semibold text-white/60 hover:text-white px-4 py-2 hover:bg-[#1C1B19] rounded-xl transition-all"
                        >
                          Remettre en attente
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                
                {filteredReservations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-white/40 text-sm">
                      Aucune réservation trouvée.
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
