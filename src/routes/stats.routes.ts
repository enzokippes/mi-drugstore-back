import { Router } from 'express';
import * as statsController from '../controllers/stats.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';

const router = Router();

router.get('/', authMiddleware, adminMiddleware, statsController.getAdminStats);

export default router;
