import express from 'express';

export default function createRoutes(db) {
  const router = express.Router();

  router.post('/users', (req, res) => {
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

  router.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  router.get('/users/:id', (req, res) => {
    db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Cliente não encontrado' });
      res.json(row);
    });
  });

  router.put('/users/:id', (req, res) => {
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

  router.delete('/users/:id', (req, res) => {
    db.run('DELETE FROM users WHERE id = ?', [req.params.id], function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ deleted: this.changes });
    });
  });

  return router;
}
