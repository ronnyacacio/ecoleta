import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import multer from 'multer';

import PointController from './controllers/PointController';
import ItemController from './controllers/ItemController';

import multerConfig from './config/multer';

const routes = Router();
const upload = multer(multerConfig);

routes.get('/items', ItemController.index);

routes.get('/points', PointController.index);
routes.get('/points/:id', PointController.show);
routes.post(
  '/points',
  upload.single('image'),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().max(2).min(2).required(),
        items: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  PointController.store
);

export default routes;
