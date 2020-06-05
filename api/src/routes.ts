import { Router } from 'express';
import multer from 'multer';

import PointController from './controllers/PointController';
import ItemController from './controllers/ItemController';

import multerConfig from './config/multer';

const routes = Router();
const upload = multer(multerConfig);

routes.get('/items', ItemController.index);

routes.get('/points', PointController.index);
routes.get('/points/:id', PointController.show);
routes.post('/points', upload.single('image'), PointController.store);

export default routes;
