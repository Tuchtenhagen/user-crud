import { Router } from 'express';


export default function createUserRoutes(controller) {
  const router = Router();

  router.post('/users', controller.create);
  router.get('/users', controller.list);
  router.get('/users/:id', controller.getById);
  router.put('/users/:id', controller.update);
  router.delete('/users/:id', controller.delete);

  return router;
}
