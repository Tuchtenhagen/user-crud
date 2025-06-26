// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      birthDate TEXT
    )
  `);
});

app.post('/users', (req, res) => {
  const { name, email, birthDate } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
  }
  db.run(
    'INSERT INTO users (name, email, birthDate) VALUES (?, ?, ?)',
    [name, email, birthDate || null],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, email, birthDate });
    }
  );
});

app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/users/:id', (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(row);
  });
});

app.put('/users/:id', (req, res) => {
  const { name, email, birthDate } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
  }
  db.run(
    'UPDATE users SET name = ?, email = ?, birthDate = ? WHERE id = ?',
    [name, email, birthDate || null, req.params.id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

app.delete('/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));