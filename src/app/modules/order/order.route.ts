import express from 'express';
import { UserRole } from '../../../enums/users';
import auth from '../../middleware/auth';
import { OrderController } from './order.controller';
const router = express.Router();

router.post('/',auth(UserRole.Buyer), OrderController.createOrder);
router.get('/', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.Buyer, UserRole.Seller), OrderController.getAllOrder);
export const OrderRoutes = router;

router.get('/:id', auth(UserRole.ADMIN, UserRole.Buyer, UserRole.Seller), OrderController.getOrder);
