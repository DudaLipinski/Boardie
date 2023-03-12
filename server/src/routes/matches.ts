import { Express } from 'express'
import * as matchesController from '../controllers/matches'
import * as matchParticipantsController from '../controllers/matchParticipants'

const matchPath = '/matches'
const participantsPath = '/participants'

export function set(app: Express) {
  app.get(`${matchPath}/:matchId`, matchesController.getById)
  app.put(`${matchPath}/:matchId`, matchesController.update)
  app.delete(`${matchPath}/:matchId`, matchesController.deleteById)

  app.get(
    `${matchPath}/:matchId/${participantsPath}`,
    matchParticipantsController.getAllByMatchId
  )
  app.post(
    `${matchPath}/:matchId/${participantsPath}`,
    matchParticipantsController.create
  )
}
