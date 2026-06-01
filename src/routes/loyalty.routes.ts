import { Router } from 'express';
import * as loyaltyController from '../controllers/loyalty.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { redeemPointsSchema, awardPointsSchema, pointRewardSchema } from '../validations/loyalty.validation';
import { validateZod } from '../middlewares/validate';

const router = Router();

/**
 * @swagger
 * /api/loyalty/my-points:
 *   get:
 *     summary: Get current user's total points
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total points
 *       401:
 *         description: Unauthorized
 */
router.get('/my-points', authMiddleware, loyaltyController.getMyPoints);

/**
 * @swagger
 * /api/loyalty/history:
 *   get:
 *     summary: Get current user's points history
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Points history
 *       401:
 *         description: Unauthorized
 */
router.get('/history', authMiddleware, loyaltyController.getMyPointsHistory);

/**
 * @swagger
 * /api/loyalty/rewards:
 *   get:
 *     summary: Get active rewards
 *     tags: [Loyalty]
 *     responses:
 *       200:
 *         description: List of active rewards
 */
router.get('/rewards', loyaltyController.getRewards);

/**
 * @swagger
 * /api/loyalty/redeem:
 *   post:
 *     summary: Redeem points for a reward
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rewardId]
 *             properties:
 *               rewardId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Points redeemed successfully
 *       400:
 *         description: Insufficient points or reward not available
 *       401:
 *         description: Unauthorized
 */
router.post('/redeem', authMiddleware, validateZod(redeemPointsSchema), loyaltyController.redeemPoints);

/**
 * @swagger
 * /api/loyalty/award:
 *   post:
 *     summary: Award points to a user (admin only)
 *     tags: [Loyalty]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, points]
 *             properties:
 *               userId:
 *                 type: string
 *               points:
 *                 type: integer
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Points awarded
 *       401:
 *         description: Unauthorized
 */
router.post('/award', authMiddleware, adminMiddleware, validateZod(awardPointsSchema), loyaltyController.awardPoints);

router.get('/admin/rewards', authMiddleware, adminMiddleware, loyaltyController.getAllRewards);
router.get('/admin/rewards/:id', authMiddleware, adminMiddleware, loyaltyController.getRewardById);
router.post('/admin/rewards', authMiddleware, adminMiddleware, validateZod(pointRewardSchema), loyaltyController.createReward);
router.put('/admin/rewards/:id', authMiddleware, adminMiddleware, validateZod(pointRewardSchema), loyaltyController.updateReward);
router.delete('/admin/rewards/:id', authMiddleware, adminMiddleware, loyaltyController.deleteReward);

export default router;
