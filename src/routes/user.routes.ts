import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { updateUserSchema, banUserSchema, adjustPointsSchema } from '../validations/user.validation';
import { validateZod } from '../middlewares/validate';

const router = Router();

router.get('/', authMiddleware, adminMiddleware, userController.getUsers);
router.get('/:id', authMiddleware, adminMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, adminMiddleware, validateZod(updateUserSchema), userController.updateUser);
router.patch('/:id/ban', authMiddleware, adminMiddleware, validateZod(banUserSchema), userController.banUser);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);
router.post('/:id/points', authMiddleware, adminMiddleware, validateZod(adjustPointsSchema), userController.adjustPoints);

export default router;
