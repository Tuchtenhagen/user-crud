import Client from '../model/Client.js';

export default class ServiceClient {
  constructor(repository) {
    this.repository = repository;
  }

  create = (req, res) => {
    try {
      const client = new Client(req.body);
      client.validate();

      this.repository.getOneByEmail(client.email, (err, existingUser) => {
        if (err) return res.status(500).json({ error: err.message });
        if (existingUser) {
          return res.status(400).json({ error: 'E-mail já está em uso.' });
        }

        this.repository.save(client, (err, result) => {
          if (err) return res.status(400).json({ error: err.message });
          res.status(201).json(result);
        });
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  list = (req, res) => {
    this.repository.getAll((err, users) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(users);
    });
  };

  getById = (req, res) => {
    this.repository.getOne(req.params.id, (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: 'Cliente não encontrado' });
      res.json(user);
    });
  };

  update = (req, res) => {
    try {
      const client = new Client({ ...req.body, id: req.params.id });
      client.validate();

      this.repository.getOneByEmail(client.email, (err, existingUser) => {
        if (err) return res.status(500).json({ error: err.message });
        if (existingUser) {
          return res.status(400).json({ error: 'E-mail já está em uso.' });
        }

        this.repository.update(req.params.id, client, (err, changes) => {
          if (err) return res.status(400).json({ error: err.message });
          res.json({ updated: changes });
        });
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  delete = (req, res) => {
    this.repository.delete(req.params.id, (err, changes) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ deleted: changes });
    });
  };
}
