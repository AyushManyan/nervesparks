import axios from 'axios';
import { getToken } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' }
});

// Add auth header automatically
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
}, err => Promise.reject(err));

export default {
  // Auth
  register: (payload) => api.post('/api/auth/register', payload),
  login: (payload) => api.post('/api/auth/login', payload),

  // Users
  me: () => api.get('/api/users/me'),
  updatePreferences: (payload) => api.patch('/api/users/me/preferences', payload),

  // Recipes
  listRecipes: () => api.get('/api/recipes'),
  createRecipe: (payload) => api.post('/api/recipes', payload),
  getRecipe: (id) => api.get(`/api/recipes/${id}`),
  updateRecipe: (id, payload) => api.put(`/api/recipes/${id}`, payload),
  deleteRecipe: (id) => api.delete(`/api/recipes/${id}`),

  // Recommend (RAG)
  recommend: ({ userId, preferences }) => api.get('/api/recommend/', { params: { userId, preferences } }),

  // Intake
  logIntake: (payload) => api.post('/api/intake', payload),
  progress: (date) => api.get('/api/intake/progress', { params: { date } }),

  // Daily Progress
  dailyProgress: () => api.get(`/api/users/daily-progress`),
  // Ingredient substitution
  substituteIngredient: (ingredient) => api.get(`/api/recipes/substitute/${encodeURIComponent(ingredient)}`),

  // Health
  healthCheck: (payload) => api.post('/api/health/check', payload),
};
 