import { Router } from 'express';

/**
 * Função que recebe um service como argumento e retorna um conjunto de rotas relacionadas a usuários.
 * O service deve conter os métodos: create, list, getById, update e delete.
 */
export default function createUserRoutes(userService) {
  const router = Router();

  // Rota para criar um novo usuário (método HTTP: POST)
  router.post('/users', userService.create);
  // Rota para listar todos os usuários (método HTTP: GET)
  router.get('/users', userService.list);
  // Rota para buscar um usuário pelo ID (método HTTP: GET)
  router.get('/users/:id', userService.getById);
  // Rota para atualizar um usuário pelo ID (método HTTP: PUT)
  router.put('/users/:id', userService.update);
  // Rota para excluir um usuário pelo ID (método HTTP: DELETE)
  router.delete('/users/:id', userService.delete);

  return router;
}
