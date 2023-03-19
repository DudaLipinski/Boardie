import type { Express } from 'express'
import * as authController from '../controllers/auth'

export function set(app: Express) {
  authController.auth.setRouter(app) // POST /auth
}
