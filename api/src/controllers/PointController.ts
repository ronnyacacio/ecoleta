import { Request, Response } from 'express';
import knex from '../database/connection';

class PointController {
  async store(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;

    const trx = await knex.transaction();

    const point = {
      image: 'image_fake',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const insertedIds = await trx('points').insert(point);

    const point_id = insertedIds[0];

    const point_items = items.map((id: number) => ({
      item_id: id,
      point_id,
    }));

    await trx('point_items').insert(point_items);

    return res.json({
      id: point_id,
      ...point,
    });
  }
}

export default new PointController();
