import { Router } from 'express';
import { createPreference, handleWebhook } from '../controllers/payment.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/create-preference', authMiddleware, createPreference);

router.post('/webhook', handleWebhook);

export default router;
