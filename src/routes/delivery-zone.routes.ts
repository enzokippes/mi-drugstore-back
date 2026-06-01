import { Router } from 'express';
import * as deliveryZoneController from '../controllers/delivery-zone.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { deliveryZoneSchema, calculateDeliverySchema } from '../validations/delivery-zone.validation';
import { validateZod } from '../middlewares/validate';

const router = Router();

/**
 * @swagger
 * /api/delivery-zones:
 *   get:
 *     summary: Get all delivery zones
 *     tags: [Delivery Zones]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active zones only
 *     responses:
 *       200:
 *         description: List of delivery zones
 */
router.get('/', deliveryZoneController.getDeliveryZones);

/**
 * @swagger
 * /api/delivery-zones/{id}:
 *   get:
 *     summary: Get a delivery zone by ID
 *     tags: [Delivery Zones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Delivery zone UUID
 *     responses:
 *       200:
 *         description: Delivery zone found
 *       404:
 *         description: Delivery zone not found
 */
router.get('/:id', deliveryZoneController.getDeliveryZoneById);

/**
 * @swagger
 * /api/delivery-zones:
 *   post:
 *     summary: Create a new delivery zone
 *     tags: [Delivery Zones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, basePrice]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Centro
 *               basePrice:
 *                 type: number
 *                 example: 1500
 *               surcharge:
 *                 type: number
 *                 example: 0
 *               maxDistanceKm:
 *                 type: number
 *                 example: 5
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Delivery zone created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, adminMiddleware, validateZod(deliveryZoneSchema), deliveryZoneController.createDeliveryZone);

/**
 * @swagger
 * /api/delivery-zones/{id}:
 *   put:
 *     summary: Update a delivery zone
 *     tags: [Delivery Zones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Delivery zone UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               basePrice:
 *                 type: number
 *               surcharge:
 *                 type: number
 *               maxDistanceKm:
 *                 type: number
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Delivery zone updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Delivery zone not found
 */
router.put('/:id', authMiddleware, adminMiddleware, validateZod(deliveryZoneSchema), deliveryZoneController.updateDeliveryZone);

/**
 * @swagger
 * /api/delivery-zones/{id}:
 *   delete:
 *     summary: Delete a delivery zone
 *     tags: [Delivery Zones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Delivery zone UUID
 *     responses:
 *       200:
 *         description: Delivery zone deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Delivery zone not found
 */
router.delete('/:id', authMiddleware, adminMiddleware, deliveryZoneController.deleteDeliveryZone);

/**
 * @swagger
 * /api/delivery-zones/calculate:
 *   post:
 *     summary: Calculate delivery cost for a zone
 *     tags: [Delivery Zones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [zoneId]
 *             properties:
 *               zoneId:
 *                 type: string
 *                 example: uuid-of-zone
 *     responses:
 *       200:
 *         description: Delivery cost calculated
 *       404:
 *         description: Zone not available
 */
router.post('/calculate', validateZod(calculateDeliverySchema), deliveryZoneController.calculateDeliveryCost);

export default router;
