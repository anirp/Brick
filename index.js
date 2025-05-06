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

app.get('/api/wins', async (req, res) => {
  const row = await db.get('SELECT count FROM wins WHERE id = 1');
  res.json({ wins: row ? row.count : 0 });
});

app.post('/api/wins', async (req, res) => {
  await db.run('UPDATE wins SET count = count + 1 WHERE id = 1');
  const row = await db.get('SELECT count FROM wins WHERE id = 1');
  res.json({ wins: row.count });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Brick Breaker backend running on http://localhost:${PORT}`);
  });
});
