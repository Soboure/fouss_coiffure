// Application Express centralisée.
// Utilisée en local (server.ts) et sur Vercel (api/index.ts).

import express from 'express';
import reservationsRouter from './routes/reservations';
import avisRouter from './routes/avis';
import { createSession } from './middleware/adminAuth';

const app = express();
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  const hasPostgres = !!(
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  );
  res.json({
    ok: true,
    vercel: !!process.env.VERCEL,
    hasPostgresUrl: hasPostgres,
    mode: 'postgres',
    time: new Date().toISOString()
  });
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const token = createSession(password);
  if (!token) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }
  res.json({ success: true, token });
});

app.use(reservationsRouter);
app.use(avisRouter);

export default app;
