import express from 'express';
import { UserRole } from '../../../enums/users';
import auth from '../../middleware/auth';
import { OrderController } from './order.controller';
const router = express.Router();

router.post('/create-order',auth(UserRole.Buyer), OrderController.createOrder);
router.get('/', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), OrderController.getAllOrder);
export const OrderRoutes = router;
