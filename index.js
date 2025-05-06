import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

let db;

async function initDB() {
  db = await open({
    filename: './wins.db',
    driver: sqlite3.Database
  });
  await db.run('CREATE TABLE IF NOT EXISTS wins (id INTEGER PRIMARY KEY, count INTEGER)');
  const row = await db.get('SELECT count FROM wins WHERE id = 1');
  if (!row) {
    await db.run('INSERT INTO wins (id, count) VALUES (1, 0)');
  }
}

app.get('/', (req, res) => {
  res.send('Brick Breaker backend is running.');
});

app.get('/api/wins', async (req, res) => {
  try {
    const row = await db.get('SELECT count FROM wins WHERE id = 1');
    res.json({ wins: row ? row.count : 0 });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get wins.' });
  }
});

app.post('/api/wins', async (req, res) => {
  try {
    await db.run('UPDATE wins SET count = count + 1 WHERE id = 1');
    const row = await db.get('SELECT count FROM wins WHERE id = 1');
    res.json({ wins: row.count });
  } catch (e) {
    res.status(500).json({ error: 'Failed to increment wins.' });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Brick Breaker backend running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize DB:', err);
});
