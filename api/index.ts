import express from 'express';
import { sql } from '@vercel/postgres';

const app = express();
app.use(express.json());

const usePostgres = !!process.env.POSTGRES_URL;
console.log("Database mode detected:", usePostgres ? "Postgres" : "SQLite");
let db: any;

// Initialize database
const initDb = async () => {
  if (!usePostgres) {
    console.warn("POSTGRES_URL not found. Falling back to SQLite (will not work on Vercel).");
    try {
      // Dynamic import to avoid loading better-sqlite3 on Vercel where it might fail
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
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
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
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log("Postgres table checked/created");
    } catch (err) {
      console.error("Postgres init error:", err);
    }
  }
};

// Call initDb
initDb();

app.get('/api/reservations', async (req, res) => {
  try {
    if (usePostgres) {
      const { rows } = await sql`SELECT * FROM reservations ORDER BY date DESC, time DESC`;
      res.json(rows);
    } else {
      if (!db) await initDb();
      const stmt = db.prepare('SELECT * FROM reservations ORDER BY date DESC, time DESC');
      res.json(stmt.all());
    }
  } catch (err: any) {
    console.error("GET reservations error:", err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const { service, date, time, space, clientName, clientPhone } = req.body;
    
    if (!service || !date || !time || !clientName || !clientPhone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (usePostgres) {
      const { rows } = await sql`
        INSERT INTO reservations (service, date, time, space, clientName, clientPhone)
        VALUES (${service}, ${date}, ${time}, ${space || 'Standard'}, ${clientName}, ${clientPhone})
        RETURNING id
      `;
      res.json({ id: rows[0].id, success: true });
    } else {
      if (!db) await initDb();
      if (!db) throw new Error('SQLite database not initialized');
      
      const stmt = db.prepare('INSERT INTO reservations (service, date, time, space, clientName, clientPhone) VALUES (?, ?, ?, ?, ?, ?)');
      const info = stmt.run(service, date, time, space || 'Standard', clientName, clientPhone);
      res.json({ id: info.lastInsertRowid, success: true });
    }
  } catch (err: any) {
    console.error('POST reservation error:', err);
    res.status(500).json({ 
      error: 'Failed to create reservation', 
      details: err.message,
      hint: !usePostgres ? 'POSTGRES_URL is missing. SQLite is not supported on Vercel. Please connect a Vercel Postgres database in your project settings.' : 'Check your database connection and table schema.'
    });
  }
});

app.patch('/api/reservations/:id', async (req, res) => {
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

export default app;
