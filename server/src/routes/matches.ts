import { Express } from 'express'
import * as matchesController from '../controllers/matches'

const matchEndpoint = '/matches'

export function set(app: Express) {
  app.get(`${matchEndpoint}/:matchId`, matchesController.getById)
  app.delete(`${matchEndpoint}/:matchId`, matchesController.deleteById)
}
