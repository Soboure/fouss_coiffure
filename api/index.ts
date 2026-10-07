// Rôle de ce fichier : la porte des rendez-vous.
// Le site et l'application envoient une fiche en POST /api/reservations.
// Champs utiles : service, date, time, clientName, clientPhone, space, code, price, source.
// Lire, confirmer ou supprimer exige le jeton administrateur, envoyé dans X-Admin-Token.
// Si POSTGRES_URL existe, les fiches vont dans Postgres. Sinon, dans salon.db, en local seulement.
// Postgres renvoie les colonnes en minuscules : clientname, pas clientName.

import express from 'express';
import avisRouter from './avis';
import { sql } from '@vercel/postgres';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// In-memory active admin sessions
const sessions = new Set<string>();

// Connexion : le mot de passe vient de ADMIN_PASSWORD, sinon du secours écrit plus bas.
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const expectedPassword = process.env.ADMIN_PASSWORD || 'fouss2024';
  if (password === expectedPassword) {
    const token = crypto.randomUUID();
    sessions.add(token);
    return res.json({ success: true, token });
  }
  return res.status(401).json({ error: 'Mot de passe incorrect' });
});

// Vérifie le jeton. Sans lui, la liste et les changements sont refusés.
const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers['x-admin-token'];
  if (!token || !sessions.has(token as string)) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  next();
};

const usePostgres = !!process.env.POSTGRES_URL;
console.log("Database mode detected:", usePostgres ? "Postgres" : "SQLite");
let db: any;

// Initialize database
let isInitialized = false;
const initDb = async () => {
  if (isInitialized) return;
  
  if (!usePostgres) {
    console.warn("POSTGRES_URL not found. Falling back to SQLite.");
    try {
      const { default: Database } = await import('better-sqlite3');
      db = new Database('salon.db');
      db.exec(`
        CREATE TABLE IF NOT EXISTS reservations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          service TEXT,
          date TEXT,
          time TEXT,
          space TEXT,
          clientName TEXT,
          clientPhone TEXT,
          status TEXT DEFAULT 'En attente',
          code TEXT,
          price TEXT,
          source TEXT DEFAULT 'site',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      for (const colonne of ['code TEXT', 'price TEXT', "source TEXT DEFAULT 'site'"]) {
        try { db.exec(`ALTER TABLE reservations ADD COLUMN ${colonne}`); } catch (e) {}
      }
      isInitialized = true;
      console.log("SQLite table checked/created");
    } catch (e) {
      console.error("SQLite init error:", e);
    }
  } else {
    try {
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
      isInitialized = true;
      console.log("Postgres table checked/created");
    } catch (err) {
      console.error("Postgres init error:", err);
    }
  }
};

// Liste des fiches. Réservée à l'administrateur.
app.get('/api/reservations', adminAuth, async (req, res) => {
  try {
    await initDb();
    if (usePostgres) {
      const { rows } = await sql`SELECT * FROM reservations ORDER BY date DESC, time DESC`;
      res.json(rows);
    } else {
      const stmt = db.prepare('SELECT * FROM reservations ORDER BY date DESC, time DESC');
      res.json(stmt.all());
    }
  } catch (err: any) {
    console.error("GET reservations error:", err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Création d'une fiche. Ouvert au site et à l'application, sans mot de passe.
app.post('/api/reservations', async (req, res) => {
  try {
    await initDb();
    const { service, date, time, space, clientName, clientPhone, code, price, source } = req.body;
    
    if (!service || !date || !time || !clientName || !clientPhone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const espace = space || 'Standard';
    const origine = source || 'site';

    if (usePostgres) {
      const { rows } = await sql`
        INSERT INTO reservations (service, date, time, space, clientName, clientPhone, code, price, source)
        VALUES (${service}, ${date}, ${time}, ${espace}, ${clientName}, ${clientPhone}, ${code || null}, ${price || null}, ${origine})
        RETURNING id, code
      `;
      res.json({ id: rows[0].id, code: rows[0].code, success: true });
    } else {
      if (!db) throw new Error('SQLite database not initialized');
      const stmt = db.prepare('INSERT INTO reservations (service, date, time, space, clientName, clientPhone, code, price, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
      const info = stmt.run(service, date, time, espace, clientName, clientPhone, code || null, price || null, origine);
      res.json({ id: info.lastInsertRowid, code, success: true });
    }
  } catch (err: any) {
    console.error('POST reservation error:', err);
    res.status(500).json({ 
      error: 'Failed to create reservation', 
      details: err.message,
      hint: !usePostgres ? 'POSTGRES_URL is missing.' : 'Check your database connection.'
    });
  }
});

// Change le statut : En attente ou Confirmé.
app.patch('/api/reservations/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (usePostgres) {
      await sql`UPDATE reservations SET status = ${status} WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } else {
      const stmt = db.prepare('UPDATE reservations SET status = ? WHERE id = ?');
      stmt.run(status, req.params.id);
      res.json({ success: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});


// Suppression technique. Le bouton n'est plus dans le tableau.
app.delete('/api/reservations/:id', adminAuth, async (req, res) => {
  try {
    await initDb();
    if (usePostgres) {
      await sql`DELETE FROM reservations WHERE id = ${req.params.id}`;
    } else {
      const stmt = db.prepare('DELETE FROM reservations WHERE id = ?');
      stmt.run(req.params.id);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});


app.use(avisRouter);

export default app;
