import sqlite3 from 'sqlite3';

// Cria uma instância do banco de dados em memória
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  // Executa uma query para criar a tabela "users" se ela ainda não existir
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      birthDate TEXT
    )
  `);
});

export default db;