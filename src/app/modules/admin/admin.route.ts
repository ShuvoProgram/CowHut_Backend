import express from 'express'
import { UserRole } from '../../../enums/users'
import auth from '../../middleware/auth'
import { AdminController } from './admin.controller'
const router = express.Router()

router.post(
  '/create-admin',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.createAdmin
)
router.post('/login', AdminController.loginAdmin)
router.post('/refresh-token', AdminController.refreshToken)
router.get(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AdminController.getSingleAdmin
)

export const AdminRoutes = router
