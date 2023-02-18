import { Express } from 'express'
import * as matchesController from '../controllers/matches'

const matchEndpoint = '/matches'

export function set(app: Express) {
  /**
   * @deprecated user POST /me/matches instead
   */
  app.post(matchEndpoint, matchesController.createForLoggedUser)

  app.get(`${matchEndpoint}/:matchId`, matchesController.getById)
}
