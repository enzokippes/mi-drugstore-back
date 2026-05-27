import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { productValidation } from '../validations/product.validation';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products with categories
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/:id', getProductById);

router.post('/', authMiddleware, adminMiddleware, upload.single('image'), productValidation, validate, createProduct);

router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), productValidation, validate, updateProduct);

router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
