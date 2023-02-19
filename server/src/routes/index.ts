import { Express } from 'express'

import * as meRoutes from './me'
import * as authRoutes from './auth'
import * as matchesRoutes from './matches'

export const setRoutes = (app: Express) => {
  meRoutes.set(app)
  authRoutes.set(app)
  matchesRoutes.set(app)
}
