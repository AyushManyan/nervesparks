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
const allowedOrigins = [
  'http://localhost:5173',
  'https://nervesparks-r9kl.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
