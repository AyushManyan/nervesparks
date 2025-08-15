import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import './config/db.js';

import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import recommendRoutes from './routes/recommendRoutes.js';
import intakeRoutes from './routes/intakeRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

import errorHandler from './middlewares/errorHandler.js';
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'https://nervesparks-r9kl.vercel.app',
  credentials: true
}));

app.use(express.json({ limit: '2mb' }));
// app.use(morgan('dev'));

app.get('/', (_, res) => res.json({ ok: true, service: 'Recipe RAG API' }));

// Public
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes); // GETs are public, mutations protected inside
app.use('/api/health', healthRoutes);

// Auth-required groups
app.use('/api/users', userRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/intake', intakeRoutes);

// Error handler
app.use(errorHandler);

export default app;
