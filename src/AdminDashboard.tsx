import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/reservations')
        .then(res => res.json())
        .then(data => setReservations(data));
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mot de passe simple pour le prototype
    if (password === 'fouss2024') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/reservations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setReservations(reservations.map(r => r.id === id ? { ...r, status } : r));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E5E3DC] max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-[#F8F7F4] p-4 rounded-full">
              <Lock className="text-[#8C7A6B]" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#4A4238] text-center mb-2">Accès Administrateur</h1>
          <p className="text-[#6B6358] text-center mb-8 text-sm">Veuillez entrer votre mot de passe pour accéder au tableau de bord.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="w-full border border-[#E5E3DC] rounded-xl px-4 py-3 bg-[#F8F7F4] focus:outline-none focus:border-[#8C7A6B]"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <button type="submit" className="w-full bg-[#4A4238] text-white py-3 rounded-xl font-medium hover:bg-[#2A2A2A] transition-colors">
              Se connecter
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-[#8C7A6B] hover:underline">Retour au site public</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#4A4238]">Tableau de Bord</h1>
          <Link to="/" className="text-[#8C7A6B] hover:underline">Retour au site</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E3DC] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#F8F7F4] border-b border-[#E5E3DC]">
              <tr>
                <th className="p-4 font-medium text-[#6B6358]">Client</th>
                <th className="p-4 font-medium text-[#6B6358]">Contact</th>
                <th className="p-4 font-medium text-[#6B6358]">Prestation</th>
                <th className="p-4 font-medium text-[#6B6358]">Date & Heure</th>
                <th className="p-4 font-medium text-[#6B6358]">Statut</th>
                <th className="p-4 font-medium text-[#6B6358]">Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id} className="border-b border-[#E5E3DC] last:border-0">
                  <td className="p-4 text-[#2A2A2A] font-medium">{res.clientName}</td>
                  <td className="p-4 text-[#6B6358]">{res.clientPhone}</td>
                  <td className="p-4 text-[#6B6358]">{res.service}</td>
                  <td className="p-4 text-[#6B6358]">{res.date} à {res.time}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      res.status === 'Confirmé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {res.status !== 'Confirmé' && (
                      <button onClick={() => updateStatus(res.id, 'Confirmé')} className="text-sm text-[#8C7A6B] hover:underline">
                        Confirmer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-[#6B6358]">Aucune réservation.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
