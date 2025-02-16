import { Router } from 'express';
import { db } from '../database/db';

const router = Router();

router.get('/courses/:id', async (req, res) => {
    try {
        const data = await db('Courses')
            .select('*')
            .where('id', req.params.id)
            .leftJoin('Sections', 'Courses.id', 'Sections.c2_id')
            .first();
        
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});

export default router;