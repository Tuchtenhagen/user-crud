# Cadastro de Clientes/Usuários

O módulo de cadastro de cliente permite registrar, visualizar, atualizar e excluir informações básicas de clientes em um sistema simples baseado em Node.js e SQLite (backend), com interface web em HTML/JavaScript (frontend).

# Cadastro de Clientes/Usuários (backend)

Este projeto é um backend simples para cadastro de clientes, utilizando **Node.js**, **Express** e **SQLite3**. Ele fornece uma API RESTful para criar, listar, atualizar e excluir clientes.

## 🛠 Tecnologias utilizadas

- **Backend:**
  - Node.js
  - Express
  - SQLite3
  - Supertest (para testes)
  - Nodemon (em desenvolvimento)
- **Frontend:**
  - HTML5
  - Bootstrap 5
  - JavaScript

---

## 📦 Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/Tuchtenhagen/user-crud.git
   cd user-crud/backend

2. Instale as dependências:
   ```bash
   npm install

## 🚀 Como iniciar o servidor

Para iniciar o servidor em modo de produção:
   ```bash
   npm start
   ```

Para iniciar em modo de desenvolvimento (com recarregamento automático usando nodemon):
   ```bash
   npm run dev
   ```

O servidor ficará disponível em: http://localhost:3000

## 💻 Como rodar o frontend

1. Vá para o diretório onde está o arquivo index.html (normalmente em frontend/ ou na raiz do projeto).

2. Você pode abrir o index.html diretamente no navegador (sem servidor), ou usar uma extensão como Live Server no VS Code para ter recarregamento automático:
   * Clique com o botão direito no ```index.html```
    * Selecione **"Open with Live Server"**

Obs: o frontend faz requisições para http://localhost:3000/users, então certifique-se de que o servidor backend está rodando localmente.

## 🧪 Executando os testes

Os testes são implementados com **node:test** e **supertest**.

Para executá-los:
   ```bash
   npm test
   ```

## 📚 Endpoints disponíveis

| Método | Rota        | Descrição                       |
| ------ | ----------- | ------------------------------- |
| GET    | /users      | Lista todos os clientes         |
| GET    | /users/\:id | Retorna um cliente específico   |
| POST   | /users      | Cria um novo cliente            |
| PUT    | /users/\:id | Atualiza os dados de um cliente |
| DELETE | /users/\:id | Remove um cliente               |

## 📂 Estrutura do projeto

   ```pgsql
project/
├── backend/
│   ├── database/
│   │   └── db-test.js
│   ├── model/
│   │   └── Client.js
│   ├── repositories/
│   │   └── ClientRepository.js
│   ├── routes/
│   │   └── user.routes.js
│   ├── service/
│   │   └── ServiceClient.js
│   ├── tests/
│   │   └── user.test.js
│   ├── server.js
│   └── package.json
│
└── frontend/
       └── index.html
```

## ⚠️ Observações
* Os dados são armazenados em memória ou em um arquivo SQLite local.

* O projeto utiliza prepared statements para proteger contra SQL Injection.

* Testes abrangem validações, segurança e consistência da API.

