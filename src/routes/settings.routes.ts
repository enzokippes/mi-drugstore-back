import { Router } from 'express';
import { getSettings, updateSetting, getPublicSettings } from '../controllers/settings.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { settingSchema } from '../validations/settings.validation';
import { validateZod } from '../middlewares/validate';

const router = Router();

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get all settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings object
 */
router.get('/', authMiddleware, adminMiddleware, getSettings);

/**
 * @swagger
 * /api/settings/public:
 *   get:
 *     summary: Get public settings (trackInventory, storeHours, deliveryHours)
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Public settings object
 */
router.get('/public', getPublicSettings);

/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: Update a setting
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [key, value]
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Setting updated
 */
router.put('/', authMiddleware, adminMiddleware, validateZod(settingSchema), updateSetting);

export default router;
