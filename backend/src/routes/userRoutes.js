import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { me, updatePreferences, getMonthlyProgress, getDailyProgress } from '../controllers/userController.js';

const router = Router();
router.use(auth);

router.get('/me', me);
router.patch('/me/preferences', updatePreferences);
router.get('/:userId/progress', getMonthlyProgress);
router.get('/:userId/daily-progress', getDailyProgress);

export default router;
