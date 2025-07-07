export default class ClientRepository {
  constructor(db) {
    this.db = db;

    // Garante que a tabela "users" exista no banco ao instanciar o repositório
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        birthDate TEXT
      )
    `);
  }

  // Insere um novo cliente no banco
  save(client, callback) {
    this.db.run(
      `INSERT INTO users (name, email, birthDate) VALUES (?, ?, ?)`,
      [client.name, client.email, client.birthDate || null], // Usa null se birthDate for undefined
      function (err) {
        // Callback com erro (se houver) e o cliente salvo com o ID gerado
        callback(err, { ...client, id: this?.lastID });
      }
    );
  }

  // Busca um cliente por ID
  getOne(id, callback) {
    this.db.get('SELECT * FROM users WHERE id = ?', [id], callback);
  }

  // Busca um cliente por e-mail
  getOneByEmail(email, callback) {
    this.db.get('SELECT * FROM users WHERE email = ?', [email], callback);
  }

  // Retorna todos os clientes cadastrados
  getAll(callback) {
    this.db.all('SELECT * FROM users', [], callback);
  }

  // Atualiza os dados de um cliente específico
  update(id, client, callback) {
    this.db.run(
      `UPDATE users SET name = ?, email = ?, birthDate = ? WHERE id = ?`,
      [client.name, client.email, client.birthDate || null, id],
      function (err) {
        // Callback com erro (se houver) e número de linhas alteradas
        callback(err, this?.changes);
      }
    );
  }

  // Exclui um cliente pelo ID
  delete(id, callback) {
    this.db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
      // Callback com erro (se houver) e número de linhas deletadas
      callback(err, this?.changes);
    });
  }
}