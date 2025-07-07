import request from 'supertest';
import test from 'node:test';
import express from 'express';
import sqlite3 from 'sqlite3';
import assert from 'node:assert/strict';

import createUserRoutes from '../routes/user.routes.js';
import ClientRepository from '../repositories/ClientRepository.js';
import ServiceClient from '../service/ServiceClient.js';


async function setupTestDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(':memory:');
    db.serialize(() => {
      db.run(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          birthDate TEXT
        )
      `, (err) => {
        if (err) reject(err);
        else resolve(db);
      });
    });
  });
}

function createTestApp(db) {
  const app = express();
  app.use(express.json());

  const repository = new ClientRepository(db);
  const serviceClient = new ServiceClient(repository);
  const routes = createUserRoutes(serviceClient);

  app.use(routes);
  return app;
}

test('API /users', async (t) => {
  const db = await setupTestDatabase();
  const app = createTestApp(db);

  await t.test('1. Protege contra SQL Injection em /users/:id', async () => {
    const res = await request(app).get('/users/1; DROP TABLE users; --');
    assert.ok(res.status >= 400);
    assert.ok(res.body.error);
  });

  await t.test('2. Falha ao cadastrar usuário com dados inválidos', async () => {
    const res = await request(app).post('/users').send({
      name: '',
      email: 'invalido.com'
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Nome e e-mail são obrigatórios.');
  });

  await t.test('3. Recusa cadastro com e-mail duplicado', async () => {
    const user = { name: 'João', email: 'joao@exemplo.com', birthDate: '1990-01-01' };

    const res1 = await request(app).post('/users').send(user);
    assert.equal(res1.status, 201);

    const res2 = await request(app).post('/users').send(user);
    assert.equal(res2.status, 400);
    assert.match(res2.body.error, /E-mail já está em uso./i);
  });

  await t.test('4. Atualiza dados do cliente com sucesso', async () => {
    const user = { name: 'Maria', email: 'maria@exemplo.com', birthDate: '1985-05-10' };
    const created = await request(app).post('/users').send(user);
    assert.equal(created.status, 201);

    const updated = await request(app).put(`/users/${created.body.id}`).send({
      name: 'Maria Clara',
      email: 'maria.clara@exemplo.com',
      birthDate: '1985-05-10'
    });
    assert.equal(updated.status, 200);
    assert.deepEqual(updated.body, { updated: 1 });
  });

  // 🔹 Teste complementar 2 - Exclusão de cliente
  await t.test('5. Exclui cliente com sucesso', async () => {
    const user = { name: 'Carlos', email: 'carlos@exemplo.com', birthDate: '1979-02-20' };
    const created = await request(app).post('/users').send(user);
    assert.equal(created.status, 201);

    console.log(created.body)

    const deleted = await request(app).delete(`/users/${created.body.id}`);
    assert.equal(deleted.status, 200);
    assert.deepEqual(deleted.body, { deleted: 1 });
  });

  await t.test('6. Retorna erro ao buscar cliente inexistente', async () => {
    const res = await request(app).get('/users/9999');
    assert.equal(res.status, 404);
    assert.equal(res.body.error, 'Cliente não encontrado');
  });

   db.close();
});