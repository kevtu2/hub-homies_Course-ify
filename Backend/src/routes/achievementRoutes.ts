import { Router } from 'express';
import { getDataOfToken, getDataOfTokenIfAvailable } from '../middleware/tokenCheckerMiddleware';
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

router.get('/achievements', getDataOfTokenIfAvailable, async (req, res) => {
    try {
        
        if(res.locals.u_id) {
            const data = await db('achievements as a')
                .leftJoin('has_achievement as ha', 'a.ach_id', '=', 'ha.ach_id')
                .leftJoin('users as u', 'ha.u_id', '=', 'u.u_id')
                .select(
                    'a.ach_id', 
                    'a.ach_name', 
                    'a.ach_text',
                    db.raw('CASE WHEN ha.u_id IS NOT NULL THEN true ELSE false END as has_achievement')
                )
                .where('u.u_id', Number(res.locals.u_id))
                .orWhereNull('ha.u_id');

            res.status(200).send(data);
        } else  {
            const data = await db('achievements')
                .select('ach_id', 'ach_name', 'ach_text');
            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

export default router;
