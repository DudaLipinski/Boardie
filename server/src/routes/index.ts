import { Express } from 'express'

import * as userRoutes from './user'
import * as meRoutes from './me'
import * as authRoutes from './auth'
import * as matchesRoutes from './matches'

export const setRoutes = (app: Express) => {
  userRoutes.set(app)
  meRoutes.set(app)
  authRoutes.set(app)
  matchesRoutes.set(app)
}
