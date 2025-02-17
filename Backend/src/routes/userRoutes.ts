import { Router } from 'express';
import { db } from '../database/db';

const router = Router();

router.get('/users/publicData', async (req, res) => {
    try {
        const data = await db('users')
            .select('u_id', 'name');

        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

export default router;
