import type { Express } from 'express'
import * as matchesController from '../controllers/matches'
import * as matchParticipantsController from '../controllers/matchParticipants'

export function set(app: Express) {
  matchesController.getById.setRouter(app) // GET /matches/:matchId
  matchesController.update.setRouter(app) // PUT /matches/:matchId
  matchesController.deleteById.setRouter(app) // DELETE /matches/:matchId

  matchParticipantsController.getAllByMatchId.setRouter(app) // GET /matches/:matchId/participants
  matchParticipantsController.create.setRouter(app) // POST /matches/:matchId/participants
  matchParticipantsController.update.setRouter(app) // PUT /matches/:matchId/participants/:participantId
  matchParticipantsController.deleteById.setRouter(app) // DELETE /matches/:matchId/participants/:participantId
}
