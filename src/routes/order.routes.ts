import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { orderValidation } from '../validations/order.validation';
import { validate } from '../middlewares/validate';

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [total, items]
 *             properties:
 *               total:
 *                 type: number
 *                 format: float
 *                 example: 5000
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [productId, quantity, price]
 *                   properties:
 *                     productId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 2500
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, orderValidation, validate, orderController.createOrder);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders with items
 *       401:
 *         description: Unauthorized
 */
router.get('/my-orders', authMiddleware, orderController.getMyOrders);

export default router;
