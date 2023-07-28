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
// router.get('/:id', UserController.getSingleUser)
router.get('/', UserController.getAllUsers)
router.delete('/:id', UserController.deleteUser)
router.patch('/:id', UserController.updateUser)

export const UserRoutes = router
