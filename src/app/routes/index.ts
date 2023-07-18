import express from 'express'
import { AdminRoutes } from '../modules/admin/admin.route'
import { AuthRouter } from '../modules/auth/auth.route'
import { CowRoutes } from '../modules/cows/cow.route'
import { OrderRoutes } from '../modules/order/order.route'
import { UserRoutes } from '../modules/users/users.route'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/cows',
    route: CowRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router
