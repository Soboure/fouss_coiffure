import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' && !location.hash;
    }
    if (path.startsWith('/#')) {
      return location.pathname === '/' && location.hash === path.substring(1);
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { label: 'Accueil', path: '/#home' },
    { label: 'Tarifs', path: '/tarifs' },
    { label: 'Galerie', path: '/galerie' },
    { label: "L'Équipe", path: '/#team' },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed w-full z-50 glass-panel border-b border-warm-200/50 py-4 top-0 left-0 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/#home" onClick={handleLinkClick} className="flex flex-col items-center justify-center cursor-pointer group">
          <span className="font-display text-3xl font-black tracking-tight text-warm-900 leading-none group-hover:scale-[1.02] transition-transform">
            FOUSS
          </span>
          <span className="font-sans text-[0.6rem] tracking-[0.3em] text-warm-500 uppercase font-semibold mt-1">
            Coiffure
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full ${
                isActive(link.path)
                  ? 'text-gold-600 font-semibold after:w-full'
                  : 'text-warm-600 hover:text-gold-500'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/#booking"
            className="flex items-center gap-2 bg-gradient-to-r from-warm-800 to-warm-700 hover:from-gold-600 hover:to-gold-500 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <Calendar size={14} />
            <span>Réserver</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-warm-800 hover:text-gold-500 transition-colors p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-[73px] bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-[73px] left-0 w-full bg-warm-100 border-b border-warm-200 shadow-lg z-50 md:hidden transition-all duration-300 transform ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-6 py-8 flex flex-col space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={handleLinkClick}
              className={`text-base font-medium py-2 border-b border-warm-200/50 transition-colors ${
                isActive(link.path) ? 'text-gold-600 font-semibold' : 'text-warm-700 hover:text-gold-500'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/#booking"
            onClick={handleLinkClick}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-warm-800 to-warm-700 hover:from-gold-600 hover:to-gold-500 text-white py-3.5 rounded-2xl text-base font-medium transition-all duration-300 shadow-md"
          >
            <Calendar size={18} />
            <span>Prendre RDV</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
