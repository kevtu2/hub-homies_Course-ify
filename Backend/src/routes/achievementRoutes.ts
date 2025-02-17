import { Router } from 'express';
import { getDataOfToken } from '../middleware/tokenCheckerMiddleware';
import { db } from '../database/db';

const router = Router();

router.get('/achievements/achievedAchievements', getDataOfToken, async (req, res) => {
    try {
        const data = await db('users as u')
            .join('has_achievement as ha', 'u.u_id', '=', 'ha.u_id')
            .join('achievements as a', 'ha.ach_id', '=', 'a.ach_id')
            .where('u.u_id', Number(res.locals.u_id))
            .select('a.ach_id', 'a.ach_name', 'a.ach_text');

        res.status(200).send(data);
    } catch (error) {
        console.log(error);
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
