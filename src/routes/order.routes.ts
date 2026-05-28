import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { createOrderSchema, updateOrderStatusSchema } from '../validations/order.validation';
import { validateZod } from '../middlewares/validate';

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
router.post('/', authMiddleware, validateZod(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authMiddleware, adminMiddleware, orderController.getAllOrders);

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

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Order status updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:id/status', authMiddleware, adminMiddleware, validateZod(updateOrderStatusSchema), orderController.updateOrderStatus);

export default router;
