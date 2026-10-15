// Accès unique à la base Postgres.
// Utilisé en local (via .env) et sur Vercel (via Environment Variables).

import { sql } from '@vercel/postgres';

export const getSql = () => sql;

export async function ensureSchema() {
  // Réservations
  await sql`
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
    )
  `;
  await sql`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS code VARCHAR(32)`;
  await sql`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS price VARCHAR(255)`;
  await sql`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS source VARCHAR(32) DEFAULT 'site'`;

  // Avis
  await sql`
    CREATE TABLE IF NOT EXISTS avis (
      id SERIAL PRIMARY KEY,
      nom VARCHAR(80),
      prestation VARCHAR(120),
      note INTEGER,
      texte VARCHAR(600),
      photo TEXT,
      status VARCHAR(32) DEFAULT 'En attente',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await sql`ALTER TABLE avis ADD COLUMN IF NOT EXISTS photo TEXT`;
}
