export default class ClientRepository {
  constructor(db) {
    this.db = db;

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        birthDate TEXT
      )
    `);
  }

  save(client, callback) {
    this.db.run(
      `INSERT INTO users (name, email, birthDate) VALUES (?, ?, ?)`,
      [client.name, client.email, client.birthDate || null],
      function (err) {
        callback(err, { ...client, id: this?.lastID });
      }
    );
  }

  getOne(id, callback) {
    this.db.get('SELECT * FROM users WHERE id = ?', [id], callback);
  }

  getOneByEmail(email, callback) {
    this.db.get('SELECT * FROM users WHERE email = ?', [email], callback);
  }

  getAll(callback) {
    this.db.all('SELECT * FROM users', [], callback);
  }

  update(id, client, callback) {
    this.db.run(
      `UPDATE users SET name = ?, email = ?, birthDate = ? WHERE id = ?`,
      [client.name, client.email, client.birthDate || null, id],
      function (err) {
        callback(err, this?.changes);
      }
    );
  }

  delete(id, callback) {
    this.db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
      callback(err, this?.changes);
    });
  }
}