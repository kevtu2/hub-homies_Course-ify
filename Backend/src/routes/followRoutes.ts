import { Router } from 'express';
import { db } from '../database/db';
import { getDataOfToken } from '../middleware/tokenCheckerMiddleware';

const router = Router();

router.get('/follows/followUser/:u_id', getDataOfToken, async (req, res) => {
  try {
    await db('follows').insert({
      flwer: res.locals.u_id,
      flwee: req.params,
    });

    res.status(200).send({ message: 'Successfully followed user!' });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error.' });
  }
});

export default router;
