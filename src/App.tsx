// Routes : quelle adresse ouvre quelle page.
// /app est l'ecran PWA. InstallPrompt affiche la banniere d'installation sur les pages client.

import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainSite from './MainSite';
import AdminDashboard from './AdminDashboard';
import TarifsPage from './TarifsPage';
import Galerie from './Galerie';
import GalerieFemme from './GalerieFemme';
import GalerieHomme from './GalerieHomme';
import GalerieEnfant from './GalerieEnfant';
import AppShell from './pwa/AppShell';
import InstallPrompt from './pwa/InstallPrompt';

function ScrollToAnchor() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToAnchor />
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/app" element={<AppShell />} />
        <Route path="/tarifs" element={<TarifsPage />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/galerie/femmes" element={<GalerieFemme />} />
        <Route path="/galerie/hommes" element={<GalerieHomme />} />
        <Route path="/galerie/enfants" element={<GalerieEnfant />} />
        <Route path="/realisations" element={<Galerie />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}
