import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { logIntake, dailyProgress } from '../controllers/intakeController.js';

const router = Router();
router.use(auth);

router.post('/', logIntake);
router.get('/progress', dailyProgress);

export default router;
