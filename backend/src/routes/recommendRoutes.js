import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { recommendations } from '../controllers/recommendController.js';

const router = Router();
router.use(auth);

// GET /api/recommend?q=&k=
router.get('/', recommendations);

export default router;
