import express from 'express'
import { UserRole } from '../../../enums/users'
import auth from '../../middleware/auth'
import { UserController } from './users.controller'

const router = express.Router()
router.get(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.getSingleUser
)
router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserController.getAllUsers
)
router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.deleteUser
)
router.patch(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.updateUser
)

router.get('/profile', auth(UserRole.Buyer, UserRole.Seller, UserRole.ADMIN), UserController.profileUser);

export const UserRoutes = router
