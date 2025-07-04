// backend/server.js
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import createUserRoutes from './routes/user.routes.js';
import ClientModel from './model/Client.js';
import UserRepository from './repositories/ClientRepository.js';
import ServiceClient from './service/ServiceClient.js';

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite');

// Injeção de dependência
const userRepository = new UserRepository(db);
const userClient = new ServiceClient(userRepository);
const routes = createUserRoutes(userClient);

app.use(routes);

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));

export default app;