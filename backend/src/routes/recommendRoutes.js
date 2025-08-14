import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { recommendations } from '../controllers/recommendController.js';

const router = Router();
router.use(auth);

router.get('/', recommendations);

export default router;
