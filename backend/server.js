// backend/server.js
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import createRoutes from './routes.js';

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      birthDate TEXT
    )
  `);
});

const routes = createRoutes(db);
app.use(routes);

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));

export default app;