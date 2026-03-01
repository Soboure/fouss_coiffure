import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainSite from './MainSite';
import AdminDashboard from './AdminDashboard';
import TarifsPage from './TarifsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route path="/tarifs" element={<TarifsPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
