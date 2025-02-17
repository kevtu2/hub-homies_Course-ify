import express from 'express';
import bookRoutes from './routes/bookRoutes';

import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import questionRoutes from './routes/questionRoutes';
import sectionRoutes from './routes/sectionRoutes';
import followRoutes from './routes/followRoutes';
import userRoutes from './routes/userRoutes';
import achievementRoutes from './routes/achievementRoutes';

import cors from 'cors';
import { setupDatabase } from './database/dbSetup';

const app = express(); // Use app instead of router for clarity
const PORT = 3000;

// Enable CORS for all origins
app.use(cors());
app.options('*', cors());

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup the database
setupDatabase();

// Base route
app.get('/', (req, res) => {
  res.send('Successful response.');
});

app.use('/api', bookRoutes);

app.use('/api', authRoutes);

app.use('/api', courseRoutes);

app.use('/api', questionRoutes);

app.use('/api', sectionRoutes);

app.use('/api', followRoutes);

app.use('/api', userRoutes);

app.use('/api', achievementRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
