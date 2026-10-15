// Rôle de ce fichier : la porte des rendez-vous.
// POST /api/reservations — ouvert.
// GET /api/health — diagnostic (pas de base de données).
// GET/PATCH/DELETE /api/reservations — admin.

import express from 'express';
import avisRouter from './avis';
import crypto from 'crypto';

const app = express();
app.use(express.json({ limit: '2mb' }));

const sessions = new Set<string>();

// Diagnostic : ne touche pas à la base. Permet de voir si la fonction démarre.
app.get('/api/health', (req, res) => {
  const hasPostgres =
    !!process.env.POSTGRES_URL ||
    !!process.env.DATABASE_URL ||
    !!process.env.POSTGRES_PRISMA_URL ||
    !!process.env.POSTGRES_URL_NON_POOLING;
  res.json({
    ok: true,
    vercel: !!process.env.VERCEL,
    hasPostgresUrl: hasPostgres,
    time: new Date().toISOString()
  });
});

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

const postgresUrl =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

const usePostgres = !!postgresUrl;
const isVercel = !!process.env.VERCEL;

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
    throw new Error('Aucune URL Postgres (POSTGRES_URL / DATABASE_URL). Vérifie les Environment Variables.');
  }

  if (!usePostgres) {
    const { default: Database } = await import('better-sqlite3');
    db = new Database('salon.db');

    // Création de la table (si elle n’existe pas)
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

    // Migration : ajoute les colonnes manquantes sur une ancienne base SQLite
    const addColumnIfMissing = (column: string, definition: string) => {
      const columns = db.prepare('PRAGMA table_info(reservations)').all() as { name: string }[];
      if (!columns.some((c: { name: string }) => c.name === column)) {
        db.exec(`ALTER TABLE reservations ADD COLUMN ${column} ${definition}`);
      }
    };

    addColumnIfMissing('code', 'TEXT');
    addColumnIfMissing('price', 'TEXT');
    addColumnIfMissing('source', "TEXT DEFAULT 'site'");

    isInitialized = true;
    return;
  }

  const s = await getSql();
  await s`
    CREATE TABLE IF NOT EXISTS reservations (
      id SERIAL PRIMARY KEY,
      service VARCHAR(255), date VARCHAR(255), time VARCHAR(255), space VARCHAR(255),
      clientName VARCHAR(255), clientPhone VARCHAR(255),
      status VARCHAR(255) DEFAULT 'En attente',
      code VARCHAR(32), price VARCHAR(255), source VARCHAR(32) DEFAULT 'site',
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
      res.json(db.prepare('SELECT * FROM reservations ORDER BY date DESC, time DESC').all());
    }
  } catch (err: any) {
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

    const info = db.prepare(
      'INSERT INTO reservations (service, date, time, space, clientName, clientPhone, code, price, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(service, date, time, espace, clientName, clientPhone, code || null, price || null, origine);
    res.json({ id: info.lastInsertRowid, code, success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to create reservation',
      details: err.message,
      hint: usePostgres
        ? 'Connexion Postgres échouée. Vérifie POSTGRES_URL / DATABASE_URL et redéploie.'
        : 'Erreur SQLite locale. Vérifie que salon.db est accessible et que le schéma est à jour.'
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
      db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, req.params.id);
    }
    res.json({ success: true });
  } catch (err: any) {
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
      db.prepare('DELETE FROM reservations WHERE id = ?').run(req.params.id);
    }
    res.status(500).json({ error: 'Failed to delete', details: err.message });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete', details: err.message });
  }
});

app.use(avisRouter);

export default app;
