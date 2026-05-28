import { Router } from 'express';
import {
  getPromotions,
  getActivePromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from '../controllers/promotion.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { promotionSchema } from '../validations/promotion.validation';
import { validateZod } from '../middlewares/validate';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/active', getActivePromotions);

router.get('/', getPromotions);

router.get('/:id', getPromotionById);

router.post('/', authMiddleware, adminMiddleware, upload.single('image'), validateZod(promotionSchema), createPromotion);

router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), validateZod(promotionSchema), updatePromotion);

router.delete('/:id', authMiddleware, adminMiddleware, deletePromotion);

export default router;
