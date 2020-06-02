import { Router } from 'express';

import PointController from './controllers/PointController';
import ItemController from './controllers/ItemController';

const routes = Router();

routes.get('/items', ItemController.index);

routes.post('/points', PointController.store);

export default routes;
