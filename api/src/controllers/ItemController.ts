import { Request, Response } from 'express';

import knex from '../database/connection';

class ItemController {
  async index(req: Request, res: Response) {
    const items = await knex('items').select('*');

    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://${process.env.IP}:${process.env.PORT}/uploads/${item.image}`,
      };
    });

    return res.json(serializedItems);
  }
}

export default new ItemController();
