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

// ✅ Allow all origins dynamically, still supports credentials
app.use(cors({
  origin: true, // Reflects request origin automatically
  credentials: true
}));

// Parse incoming JSON requests
app.use(express.json({ limit: '2mb' }));

// Optional logging
// app.use(morgan('dev'));

// Test route
app.get('/', (_, res) => res.json({ ok: true, service: 'Recipe RAG API' }));

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes); // GETs are public, mutations protected inside
app.use('/api/health', healthRoutes);

// Auth-required routes
app.use('/api/users', userRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/intake', intakeRoutes);

// Error handler middleware
app.use(errorHandler);

export default app;
