import { Router } from 'express';
import { db } from '../database/db';

const router = Router();

router.get('/sections/:s_id', async (req, res) => {
  try {
    const data = db('sections as s')
      .select('s.*', 'q.*')
      .leftJoin('questions as q', 's.s_id', '=', 'q.s_id')
      .where('s.s_id', Number(req.params.s_id))
      .first();

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

export default router;
