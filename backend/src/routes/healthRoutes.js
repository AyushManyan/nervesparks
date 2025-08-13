import { Router } from 'express';
import { healthCheck } from '../controllers/healthController.js';

const router = Router();
router.post('/check', healthCheck);

export default router;
