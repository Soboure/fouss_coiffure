import express from 'express';
import Database from 'better-sqlite3';
import { sql } from '@vercel/postgres';

const app = express();
app.use(express.json());

const usePostgres = !!process.env.POSTGRES_URL;
console.log("Database mode detected:", usePostgres ? "Postgres" : "SQLite");
let db: any;

if (!usePostgres) {
  console.warn("POSTGRES_URL not found. Falling back to SQLite (will not work on Vercel).");
  try {
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
  } catch (e) {
    console.error("SQLite init error:", e);
  }
} else {
  // Ensure table exists
  const initTable = async () => {
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
  };
  initTable();
}

app.get('/api/reservations', async (req, res) => {
  try {
    if (usePostgres) {
      const { rows } = await sql`SELECT * FROM reservations ORDER BY date DESC, time DESC`;
      res.json(rows);
    } else {
      const stmt = db.prepare('SELECT * FROM reservations ORDER BY date DESC, time DESC');
      res.json(stmt.all());
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const { service, date, time, space, clientName, clientPhone } = req.body;
    if (usePostgres) {
      const { rows } = await sql`
        INSERT INTO reservations (service, date, time, space, clientName, clientPhone)
        VALUES (${service}, ${date}, ${time}, ${space}, ${clientName}, ${clientPhone})
        RETURNING id
      `;
      res.json({ id: rows[0].id, success: true });
    } else {
      if (!db) {
        throw new Error('Database not initialized. Please connect a database to your project.');
      }
      const stmt = db.prepare('INSERT INTO reservations (service, date, time, space, clientName, clientPhone) VALUES (?, ?, ?, ?, ?, ?)');
      const info = stmt.run(service, date, time, space, clientName, clientPhone);
      res.json({ id: info.lastInsertRowid, success: true });
    }
  } catch (err: any) {
    console.error('Reservation error:', err);
    res.status(500).json({ 
      error: 'Failed to create reservation', 
      details: err.message,
      hint: !usePostgres ? 'SQLite is not supported on Vercel. Please connect a Vercel Postgres database.' : undefined
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
