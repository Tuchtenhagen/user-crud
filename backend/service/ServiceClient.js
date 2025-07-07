import Client from '../model/Client.js';

// Classe ServiceClient que encapsula a lógica de negócio relacionada aos clientes
export default class ServiceClient {
  constructor(repository) {
    // O repositório é injetado via construtor e será usado para acesso ao banco de dados
    this.repository = repository;
  }

  // Método para criar um novo cliente
  create = (req, res) => {
    try {
      // Cria um novo cliente a partir dos dados da requisição
      const client = new Client(req.body);
      // Valida os dados do cliente (por exemplo, nome e e-mail obrigatórios)
      client.validate();

      // Verifica se já existe um usuário com o mesmo e-mail
      this.repository.getOneByEmail(client.email, (err, existingUser) => {
        if (err) return res.status(500).json({ error: err.message });
        if (existingUser) {
          return res.status(400).json({ error: 'E-mail já está em uso.' });
        }

        // Salva o novo cliente no banco de dados
        this.repository.save(client, (err, result) => {
          if (err) return res.status(400).json({ error: err.message });
          res.status(201).json(result); // Sucesso na criação
        });
      });
    } catch (err) {
      res.status(400).json({ error: err.message });  // Erro de validação
    }
  };

  // Método para listar todos os clientes
  list = (req, res) => {
    this.repository.getAll((err, users) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(users);
    });
  };

  // Método para buscar um cliente pelo ID
  getById = (req, res) => {
    this.repository.getOne(req.params.id, (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: 'Cliente não encontrado' });
      res.json(user);
    });
  };

  // Método para atualizar um cliente
  update = (req, res) => {
    try {
      // Cria uma instância de cliente com os novos dados, incluindo o ID
      const client = new Client({ ...req.body, id: req.params.id });
      client.validate();

      // Verifica se o novo e-mail já está sendo usado por outro cliente
      this.repository.getOneByEmail(client.email, (err, existingUser) => {
        if (err) return res.status(500).json({ error: err.message });
        if (existingUser) {
          return res.status(400).json({ error: 'E-mail já está em uso.' });
        }

        this.repository.update(req.params.id, client, (err, changes) => {
          if (err) return res.status(400).json({ error: err.message });
          res.json({ updated: changes }); // Retorna o número de registros alterados
        });
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  // Método para excluir um cliente
  delete = (req, res) => {
    this.repository.delete(req.params.id, (err, changes) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ deleted: changes });
    });
  };
}
