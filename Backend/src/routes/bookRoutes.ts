import { Router } from 'express';
import { db } from '../database/db';

const router = Router();

router.post('/books', async (req, res) => {
  try {
    const formattedDate = new Date(req.body.date_published).toISOString().split('T')[0];

    await db('books').insert({
      title: req.body.title,
      author: req.body.author,
      date_published: formattedDate,
    });
    res.status(200).send({ message: 'Book added successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error.' });
  }
});

router.get('/books', async (req, res) => {
  try {
    await db('books')
      .select('*')
      .then(books => {
        res.status(200).send(books);
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error.' });
  }
});

router.delete('/books/:id', async (req, res) => {
  try {
    await db('books').delete().where('id', req.params.id);
    res.status(200).send({ message: 'Book deleted successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error.' });
  }
});

router.put('/books/:id', async (req, res) => {
  try {
    const formattedDate = new Date(req.body.date_published).toISOString().split('T')[0];

    await db('books')
      .update({
        title: req.body.title,
        author: req.body.author,
        date_published: formattedDate,
      })
      .where('id', req.params.id);
    res.status(200).send({ message: 'Book updated successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

export default router;
