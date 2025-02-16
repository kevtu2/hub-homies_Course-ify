import express from 'express';
import bookRoutes from './routes/bookRoutes';

//import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';

import cors from 'cors';
import { setupDatabase } from './database/dbSetup';

const app = express();  // Use app instead of router for clarity
const PORT = 3000;

// Enable CORS for all origins
app.use(cors());
app.options('*', cors());

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup the database
setupDatabase();

// API routes
app.use('/api', bookRoutes);
app.use('/api', courseRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Successful response.');
});

app.use('/api', bookRoutes);

//app.use('/api', authRoutes);

app.use('/api', courseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
