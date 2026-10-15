import express from 'express';
import { getSql, ensureSchema } from '../db';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

router.get('/api/reservations', adminAuth, async (_req, res) => {
  try {
    await ensureSchema();
    const sql = getSql();
    const { rows } = await sql`SELECT * FROM reservations ORDER BY date DESC, time DESC`;
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.post('/api/reservations', async (req, res) => {
  try {
    await ensureSchema();
    const { service, date, time, space, clientName, clientPhone, code, price, source } = req.body;

    if (!service || !date || !time || !clientName || !clientPhone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const espace = space || 'Standard';
    const origine = source || 'site';
    const sql = getSql();

    const { rows } = await sql`
      INSERT INTO reservations (service, date, time, space, clientName, clientPhone, code, price, source)
      VALUES (${service}, ${date}, ${time}, ${espace}, ${clientName}, ${clientPhone}, ${code || null}, ${price || null}, ${origine})
      RETURNING id, code
    `;

    res.json({ id: rows[0].id, code: rows[0].code, success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to create reservation',
      details: err.message,
      hint: 'Vérifie POSTGRES_URL (ou DATABASE_URL) dans le .env local ou les Environment Variables Vercel.'
    });
  }
});

router.patch('/api/reservations/:id', adminAuth, async (req, res) => {
  try {
    await ensureSchema();
    const { status } = req.body;
    const sql = getSql();
    await sql`UPDATE reservations SET status = ${status} WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update', details: err.message });
  }
});

router.delete('/api/reservations/:id', adminAuth, async (req, res) => {
  try {
    await ensureSchema();
    const sql = getSql();
    await sql`DELETE FROM reservations WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete', details: err.message });
  }
});

export default router;
