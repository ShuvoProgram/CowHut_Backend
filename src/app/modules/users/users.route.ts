import express from 'express'
import { UserRole } from '../../../enums/users'
import auth from '../../middleware/auth'
import { UserController } from './users.controller'

const router = express.Router();

router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.getAllUsers
)

router.get('/my-profile',auth(UserRole.ADMIN, UserRole.Seller, UserRole.Buyer), UserController.ProfileUser);

router.patch('/my-profile',auth(UserRole.ADMIN, UserRole.Seller, UserRole.Buyer), UserController.updateProfile);

router.patch(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.updateUser
)

router.get(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.getSingleUser
)

router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.deleteUser
)


export const UserRoutes = router
