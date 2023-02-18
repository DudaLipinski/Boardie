import { Express } from 'express'
import * as userController from '../controllers/user'
import * as matchesController from '../controllers/matches'

const userEndpoint = '/user'

export function set(app: Express) {
  /**
   * Deprecated: use /me instead
   */
  app.post(userEndpoint, userController.create)
  /**
   * Deprecated: use /me/matches instead
   */
  app.get(`${userEndpoint}/matches`, matchesController.getAllByLoggedUser)
}
