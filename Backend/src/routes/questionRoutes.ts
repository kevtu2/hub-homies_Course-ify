import { Router } from 'express';
import { db } from '../database/db';
import { getDataOfToken } from '../middleware/tokenCheckerMiddleware';

const router = Router();

router.get('/answerQuestion/:q_id', getDataOfToken, async (req, res) => {
  try {
    await db('user_answered').insert({
      u_id: res.locals.u_id,
      q_id: req.params.q_id,
      a_picked: req.body.a_picked,
    });
    res.status(200).send({ message: 'Recorded answer.' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.get('/questions/:s_id', async (req, res) => {
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
