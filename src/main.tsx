// Rôle de ce fichier : point d'entrée du site.
// Il affiche App dans la page, avec le routeur.
// On ne met pas les pages ici. Si le site ne s'ouvre pas du tout, on regarde ici en premier.

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
