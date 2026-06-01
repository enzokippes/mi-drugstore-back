import { Router } from 'express';
import * as addressController from '../controllers/address.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { addressSchema } from '../validations/address.validation';
import { validateZod } from '../middlewares/validate';

const router = Router();

router.use(authMiddleware);

router.get('/', addressController.getMyAddresses);
router.get('/:id', addressController.getAddressById);
router.post('/', validateZod(addressSchema), addressController.createAddress);
router.put('/:id', validateZod(addressSchema), addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

export default router;
