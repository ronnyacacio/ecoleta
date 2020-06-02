import { Router } from 'express';

import PointController from './controllers/PointController';
import ItemController from './controllers/ItemController';

const routes = Router();

routes.get('/items', ItemController.index);

routes.get('/points/:id', PointController.show);
routes.get('/points', PointController.index);
routes.post('/points', PointController.store);

export default routes;
