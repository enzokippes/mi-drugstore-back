import { Router } from 'express';
import * as popularController from '../controllers/popular.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';

const router = Router();

router.get('/popular', popularController.getPopularProducts);
router.get('/featured', popularController.getFeaturedProducts);
router.get('/suggestions', authMiddleware, adminMiddleware, popularController.getPopularSuggestions);

export default router;
