import { Router } from 'express';
import { getDataOfToken } from '../middleware/tokenCheckerMiddleware';
import { db } from '../database/db';

const router = Router();

router.get('/achievedAchievements', getDataOfToken, async (req, res) => {
    try {
        const data = await db('users as u')
            .leftJoin('has_achievement as ha', 'u.u_id', '=', 'ha.u_id')
            .leftJoin('achievements as a', 'ha.a_id', '=', 'a.a_id')
            .where('u.u_id', res.locals.u_id)
            .select('a.*');

        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

router.get('/achievements', async (req, res) => {
    try {
        const data = await db('achievements')
            .select('*');

        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

export default router;
