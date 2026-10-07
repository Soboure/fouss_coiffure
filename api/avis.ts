// Avis clients.
// Le public envoie un avis. Il n'apparaît qu'après publication dans l'admin.
// GET /api/avis : avis publiés. POST /api/avis : nouvel avis en attente.
// GET /api/avis/moderation et PATCH exigent X-Admin-Token.

import express from 'express';
import { sql } from '@vercel/postgres';

const router = express.Router();
const usePostgres = !!process.env.POSTGRES_URL;
let db: any;
let ready = false;

async function initAvis() {
  if (ready) return;
  if (!usePostgres) {
    const { default: Database } = await import('better-sqlite3');
    db = new Database('salon.db');
    db.exec(`
      CREATE TABLE IF NOT EXISTS avis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT,
        prestation TEXT,
        note INTEGER,
        texte TEXT,
        status TEXT DEFAULT 'En attente',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } else {
    await sql`
      CREATE TABLE IF NOT EXISTS avis (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(80),
        prestation VARCHAR(120),
        note INTEGER,
        texte VARCHAR(600),
        status VARCHAR(32) DEFAULT 'En attente',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  }
  ready = true;
}

function propre(valeur: unknown, max: number) {
  return String(valeur || '').trim().slice(0, max);
}

router.get('/api/avis', async (_req, res) => {
  try {
    await initAvis();
    if (usePostgres) {
      const { rows } = await sql`SELECT id, nom, prestation, note, texte FROM avis WHERE status = 'Publié' ORDER BY id DESC`;
      return res.json(rows);
    }
    return res.json(db.prepare(`SELECT id, nom, prestation, note, texte FROM avis WHERE status = 'Publié' ORDER BY id DESC`).all());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/avis', async (req, res) => {
  try {
    await initAvis();
    const nom = propre(req.body.nom, 80);
    const prestation = propre(req.body.prestation, 120);
    const texte = propre(req.body.texte, 600);
    const note = Math.min(5, Math.max(1, Number(req.body.note) || 0));
    if (!nom || !prestation || !texte || !note) {
      return res.status(400).json({ error: 'Nom, prestation, note et avis sont requis' });
    }
    if (usePostgres) {
      await sql`INSERT INTO avis (nom, prestation, note, texte) VALUES (${nom}, ${prestation}, ${note}, ${texte})`;
    } else {
      db.prepare('INSERT INTO avis (nom, prestation, note, texte) VALUES (?, ?, ?, ?)').run(nom, prestation, note, texte);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/avis/moderation', async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token) return res.status(401).json({ error: 'Non autorisé' });
  try {
    await initAvis();
    if (usePostgres) {
      const { rows } = await sql`SELECT * FROM avis ORDER BY id DESC`;
      return res.json(rows);
    }
    return res.json(db.prepare('SELECT * FROM avis ORDER BY id DESC').all());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/api/avis/:id', async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token) return res.status(401).json({ error: 'Non autorisé' });
  const status = req.body.status === 'Publié' ? 'Publié' : 'En attente';
  try {
    await initAvis();
    const id = Number(req.params.id);
    if (usePostgres) {
      await sql`UPDATE avis SET status = ${status} WHERE id = ${id}`;
    } else {
      db.prepare('UPDATE avis SET status = ? WHERE id = ?').run(status, id);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
