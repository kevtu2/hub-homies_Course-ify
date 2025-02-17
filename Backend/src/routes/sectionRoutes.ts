import { Router } from 'express';
import { db } from '../database/db';
import knex from 'knex';

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
router.get('/user/:u_id/section/:s_id', async (req, res) => {
  try {
    const userId = parseInt(req.params.u_id);
    const sectionId = parseInt(req.params.s_id);
    if (isNaN(userId) || isNaN(sectionId)) {
      return res.status(400).send({ message: 'Invalid user ID or section ID provided' });
    }
    const data = await knex('sections')
      .select('sections.s_name', 'section_finished.date_finished')
      .join('section_finished', 'sections.s_id', '=', 'section_finished.s_id')
      .where({
        'section_finished.u_id': userId,
        'sections.s_id': sectionId
      })
      .first(); 

    if (!data) {
      return res.status(404).send({ message: 'Section or completion record not found' });
    }

    res.status(200).send(data);
  } catch (error) {
    console.error('Failed to fetch section details:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

export default router;

