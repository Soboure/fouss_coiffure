import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';

const db = new Database('salon.db');

// Initialize Database
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
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/reservations', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM reservations ORDER BY date DESC, time DESC');
      res.json(stmt.all());
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.post('/api/reservations', (req, res) => {
    try {
      const { service, date, time, space, clientName, clientPhone } = req.body;
      const stmt = db.prepare('INSERT INTO reservations (service, date, time, space, clientName, clientPhone) VALUES (?, ?, ?, ?, ?, ?)');
      const info = stmt.run(service, date, time, space, clientName, clientPhone);
      res.json({ id: info.lastInsertRowid, success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create reservation' });
    }
  });

  app.patch('/api/reservations/:id', (req, res) => {
    try {
      const { status } = req.body;
      const stmt = db.prepare('UPDATE reservations SET status = ? WHERE id = ?');
      stmt.run(status, req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update reservation' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
