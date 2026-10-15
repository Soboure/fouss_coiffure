-- Schéma Postgres utilisé en local et sur Vercel.
-- Exécute ces commandes une fois sur ta base (Neon / Vercel Postgres).

CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  service VARCHAR(255),
  date VARCHAR(255),
  time VARCHAR(255),
  space VARCHAR(255),
  clientName VARCHAR(255),
  clientPhone VARCHAR(255),
  status VARCHAR(255) DEFAULT 'En attente',
  code VARCHAR(32),
  price VARCHAR(255),
  source VARCHAR(32) DEFAULT 'site',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS avis (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(80),
  prestation VARCHAR(120),
  note INTEGER,
  texte VARCHAR(600),
  photo TEXT,
  status VARCHAR(32) DEFAULT 'En attente',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
