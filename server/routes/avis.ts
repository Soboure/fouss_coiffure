import express from 'express';
import { getSql, ensureSchema } from '../db';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

function propre(valeur: unknown, max: number) {
  return String(valeur || '').trim().slice(0, max);
}

function photoValide(valeur: unknown) {
  const photo = String(valeur || '');
  if (!photo) return '';
  if (!photo.startsWith('data:image/jpeg;base64,')) return '';
  if (photo.length > 500000) return '';
  return photo;
}

router.get('/api/avis', async (_req, res) => {
  try {
    await ensureSchema();
    const sql = getSql();
    const { rows } = await sql`SELECT id, nom, prestation, note, texte, photo FROM avis WHERE status = 'Publié' ORDER BY id DESC`;
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/avis', async (req, res) => {
  try {
    await ensureSchema();
    const nom = propre(req.body.nom, 80);
    const prestation = propre(req.body.prestation, 120);
    const texte = propre(req.body.texte, 600);
    const photo = photoValide(req.body.photo);
    const note = Math.min(5, Math.max(1, Number(req.body.note) || 0));

    if (!nom || !prestation || !texte || !note) {
      return res.status(400).json({ error: 'Nom, prestation, note et avis sont requis' });
    }
    if (req.body.photo && !photo) {
      return res.status(400).json({ error: 'Photo trop lourde ou format non accepté' });
    }

    const sql = getSql();
    await sql`INSERT INTO avis (nom, prestation, note, texte, photo) VALUES (${nom}, ${prestation}, ${note}, ${texte}, ${photo || null})`;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/avis/moderation', adminAuth, async (_req, res) => {
  try {
    await ensureSchema();
    const sql = getSql();
    const { rows } = await sql`SELECT * FROM avis ORDER BY id DESC`;
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/api/avis/:id', adminAuth, async (req, res) => {
  try {
    await ensureSchema();
    const status = req.body.status === 'Publié' ? 'Publié' : 'En attente';
    const id = Number(req.params.id);
    const sql = getSql();
    await sql`UPDATE avis SET status = ${status} WHERE id = ${id}`;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
