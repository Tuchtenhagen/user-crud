import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import createUserRoutes from './routes/user.routes.js';
import UserRepository from './repositories/ClientRepository.js';
import ServiceClient from './service/ServiceClient.js';

// Inicializa a aplicação Express
const app = express();

// Aplica middleware para permitir requisições de outras origens
app.use(cors());
// Aplica middleware para interpretar JSON nas requisições
app.use(express.json());

// Cria ou conecta-se ao banco de dados SQLite em disco
const db = new sqlite3.Database('./database.sqlite');

// Injeta dependências: repositório -> serviço -> rotas
const userRepository = new UserRepository(db); // Lida com o banco
const userClient = new ServiceClient(userRepository); // Lida com regras de negócio
const routes = createUserRoutes(userClient); // Define rotas HTTP usando o serviço

// Registra as rotas no app Express
app.use(routes);

// Inicia o servidor HTTP na porta 3000
app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));

export default app;