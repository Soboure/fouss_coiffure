// Rôle de ce fichier : la porte des rendez-vous.
// POST /api/reservations — ouvert.
// GET/PATCH/DELETE — admin (X-Admin-Token).
// Sur Vercel : utilise POSTGRES_URL (ou DATABASE_URL / POSTGRES_PRISMA_URL).
// En local : fallback SQLite si aucune URL Postgres.

import express from 'express';
import avisRouter from './avis';
import crypto from 'crypto';

const app = express();
app.use(express.json({ limit: '2mb' }));

const sessions = new Set<string>();

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

const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers['x-admin-token'];
  if (!token || !sessions.has(token as string)) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  next();
};

// Cherche une URL Postgres parmi les noms courants
const postgresUrl =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

const usePostgres = !!postgresUrl;
const isVercel = !!process.env.VERCEL;
console.log('DB mode:', usePostgres ? 'Postgres' : 'SQLite', '| Vercel:', isVercel, '| URL present:', !!postgresUrl);

let db: any;
let sql: any;
let isInitialized = false;

async function getSql() {
  if (sql) return sql;
  const mod = await import('@vercel/postgres');
  sql = mod.sql;
  return sql;
}

const initDb = async () => {
  if (isInitialized) return;

  if (isVercel && !usePostgres) {
    throw new Error('Aucune URL Postgres trouvée (POSTGRES_URL, DATABASE_URL, etc.). Vérifie les Environment Variables.');
  }

  if (!usePostgres) {
    const { default: Database } = await import('better-sqlite3');
    db = new Database('salon.db');
    db.exec(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service TEXT, date TEXT, time TEXT, space TEXT,
        clientName TEXT, clientPhone TEXT,
        status TEXT DEFAULT 'En attente',
        code TEXT, price TEXT, source TEXT DEFAULT 'site',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    isInitialized = true;
    return;
  }

  // Postgres
  const s = await getSql();
  await s`
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
  await s`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS code VARCHAR(32)`;
  await s`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS price VARCHAR(255)`;
  await s`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS source VARCHAR(32) DEFAULT 'site'`;
  isInitialized = true;
};

app.get('/api/reservations', adminAuth, async (req, res) => {
  try {
    await initDb();
    if (usePostgres) {
      const s = await getSql();
      const { rows } = await s`SELECT * FROM reservations ORDER BY date DESC, time DESC`;
      res.json(rows);
    } else {
      const stmt = db.prepare('SELECT * FROM reservations ORDER BY date DESC, time DESC');
      res.json(stmt.all());
    }
  } catch (err: any) {
    console.error('GET error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

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
      const s = await getSql();
      const { rows } = await s`
        INSERT INTO reservations (service, date, time, space, clientName, clientPhone, code, price, source)
        VALUES (${service}, ${date}, ${time}, ${espace}, ${clientName}, ${clientPhone}, ${code || null}, ${price || null}, ${origine})
        RETURNING id, code
      `;
      return res.json({ id: rows[0].id, code: rows[0].code, success: true });
    }

    if (!db) throw new Error('SQLite not initialized');
    const stmt = db.prepare(
      'INSERT INTO reservations (service, date, time, space, clientName, clientPhone, code, price, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const info = stmt.run(service, date, time, espace, clientName, clientPhone, code || null, price || null, origine);
    res.json({ id: info.lastInsertRowid, code, success: true });
  } catch (err: any) {
    console.error('POST reservation error:', err);
    res.status(500).json({
      error: 'Failed to create reservation',
      details: err.message,
      hint: !usePostgres
        ? 'Aucune connexion Postgres. Vérifie POSTGRES_URL (ou DATABASE_URL) dans les Environment Variables Vercel, puis redéploie.'
        : 'Erreur de connexion à la base. Vérifie que la variable Postgres est valide et que la base est accessible.'
    });
  }
});

app.patch('/api/reservations/:id', adminAuth, async (req, res) => {
  try {
    await initDb();
    const { status } = req.body;
    if (usePostgres) {
      const s = await getSql();
      await s`UPDATE reservations SET status = ${status} WHERE id = ${req.params.id}`;
    } else {
      const stmt = db.prepare('UPDATE reservations SET status = ? WHERE id = ?');
      stmt.run(status, req.params.id);
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update', details: err.message });
  }
});

app.delete('/api/reservations/:id', adminAuth, async (req, res) => {
  try {
    await initDb();
    if (usePostgres) {
      const s = await getSql();
      await s`DELETE FROM reservations WHERE id = ${req.params.id}`;
    } else {
      const stmt = db.prepare('DELETE FROM reservations WHERE id = ?');
      stmt.run(req.params.id);
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete', details: err.message });
  }
});

app.use(avisRouter);

export default app;
