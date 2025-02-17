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

router.get('/followers/:u_id', async (req, res) => {
    try {
      const data = await db('users as u')
        .leftJoin('follows as f', 'u.u_id', '=', 'f.flwee')
        .leftJoin('users as u2', 'f.flwer', '=', 'u2.u_id')
        .select('u2.name', 'u2.u_id')
      
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send({ message: 'Internal server error.' });
    }
})

export default router;
