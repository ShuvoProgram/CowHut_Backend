import express from 'express'
import { UserRole } from '../../../enums/users'
import auth from '../../middleware/auth'
import { CowController } from './cow.controller'

const router = express.Router()

router.post('/create-cow',auth(UserRole.Seller), CowController.createCow)
router.get('/:id', CowController.getSingleCow)
router.get('/', CowController.getAllCow)
router.delete('/:id', auth(UserRole.Seller), CowController.deleteCow)
router.patch('/:id', auth(UserRole.Seller), CowController.updateCow)

export const CowRoutes = router
