import express from 'express';
import bookRoutes from './routes/bookRoutes';
import cors from 'cors';
import { setupDatabase } from './database/dbSetup';

const router = express();

const PORT = 3000;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cors());

setupDatabase();

router.get('/', (req, res) => {
  res.send('Successful response.');
});

router.use('/api', bookRoutes);

router.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
