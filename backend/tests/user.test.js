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

await test('1. SQL INJECTION', async (t) => {
  const db = await setupTestDatabase();
  const app = createTestApp(db);

  await t.test('1.1 Protege contra SQL Injection ao cadastrar um novo usuário', async () => {
    const res = await request(app).post('/users').send({
      name: "Cadastrado'; DROP TABLE users; --",
      email: "ataque1@example.com",
      birthDate: "1999-09-09"
    });
    assert.ok(res.status == 201);
    assert.ok(res.body);
  });

  await t.test('1.2 Protege contra SQL Injection ao atualizar um usuário', async () => {
    const user = await request(app).post('/users').send({
      name: 'Normal User',
      email: 'normal@example.com',
    });

    const res = await request(app).put(`/users/${user.body.id}`).send({
      name: "Atualizado'; DROP TABLE users; --",
      email: "atualizado@example.com",
    });

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { updated: 1 });
  });

   db.close();
});

await test('2. VALIDAÇÃO DE DADOS', async (t) => {
  const db = await setupTestDatabase();
  const app = createTestApp(db);

  await t.test('2.1 POST /users com nome vazio e email inválido deve falhar', async () => {
    const res = await request(app).post('/users').send({
      name: '',
      email: 'invalido.com'
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, 'Nome e e-mail são obrigatórios.');
  });

  await t.test('2.2 PUT /users/:id com nome vazio deve falhar', async () => {
    const user = { name: 'Ana', email: 'ana@exemplo.com', birthDate: '1990-01-01' };

    const created = await request(app).post('/users').send(user);
    assert.equal(created.status, 201);

    const res = await request(app).put(`/users/${created.body.id}`).send({
      ...user,
      name: ''
    });

    assert.equal(res.status, 400);
    assert.ok(res.body.error);
    assert.equal(res.body.error, 'Nome e e-mail são obrigatórios.');
  });

  await t.test('2.3 PUT /users/:id com email inválido deve falhar', async () => {
    const user = { name: 'João', email: 'joao@exemplo.com', birthDate: '1990-01-01' };

    const created = await request(app).post('/users').send(user);
    assert.equal(created.status, 201);

    const res = await request(app).put(`/users/${created.body.id}`).send({
      ...user,
      email: 'joaoexemplo.com'
    });
    
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
    assert.equal(res.body.error, 'E-mail inválido.');
  });

   db.close();
});

await test('3. E-MAIL DUPLICADO', async (t) => {
  const db = await setupTestDatabase();
  const app = createTestApp(db);

  await t.test('3.1 Não permite atualizar e-mail para um já existente', async () => {
    await request(app).post('/users').send({
      name: 'Ana',
      email: 'ana@example.com'
    });

    const user2 = await request(app).post('/users').send({
      name: 'Carlos',
      email: 'carlos@example.com'
    });

    const res = await request(app).put(`/users/${user2.body.id}`).send({
      name: 'Carlos',
      email: 'ana@example.com'
    });

    assert.equal(res.status, 400);
    assert.match(res.body.error, /E-mail já está em uso./i);
  });

  await t.test('3.2 Não permite cadastrar dois usuários com o mesmo e-mail', async () => {
    const user = { name: 'João', email: 'joao@exemplo.com', birthDate: '1990-01-01' };

    const res1 = await request(app).post('/users').send(user);
    assert.equal(res1.status, 201);

    const res2 = await request(app).post('/users').send(user);
    assert.equal(res2.status, 400);
    assert.match(res2.body.error, /E-mail já está em uso./i);
  });

   db.close();
});