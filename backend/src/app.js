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

const app = express();

// ✅ Global CORS + Preflight handling
app.use(cors({
  origin: true, // Reflects request origin
  credentials: true
}));
app.options('*', cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '2mb' }));
// app.use(morgan('dev'));

app.get('/', (_, res) => res.json({ ok: true, service: 'Recipe RAG API' }));

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/health', healthRoutes);

// Auth-required routes
app.use('/api/users', userRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/intake', intakeRoutes);

// Error handler
app.use(errorHandler);

export default app;
