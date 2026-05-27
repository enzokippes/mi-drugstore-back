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
import { promotionValidation } from '../validations/promotion.validation';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/active', getActivePromotions);

router.get('/', getPromotions);

router.get('/:id', getPromotionById);

router.post('/', authMiddleware, adminMiddleware, upload.single('image'), promotionValidation, validate, createPromotion);

router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), promotionValidation, validate, updatePromotion);

router.delete('/:id', authMiddleware, adminMiddleware, deletePromotion);

export default router;
