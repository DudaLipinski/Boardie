import { RequestHandler } from 'express'
import * as matchesModel from '../models/matches'
import * as matchParticipantsModel from '../models/matchParticipants'
import * as friendsModel from '../models/friends'
import {
  MatchParticipantCreationData,
  MatchParticipantDTO,
  MatchParticipantUpdateData,
  validateMatchParticipantCreationData,
  validateMatchParticipantUpdateData,
} from '../schemas/matchParticipant'
import { getErrorMessage } from '../schemas/utils'
import { ErrorBody } from '../types/errors'
import { logInternalError } from '../utils/log'
import { FORBIDDEN_ERROR } from '../utils/errors'

export const getAllByMatchId: RequestHandler<
  { matchId: string },
  MatchParticipantDTO[]
> = async (req, res) => {
  const { matchId } = req.params
  if (!matchId) {
    return res.sendStatus(400)
  }

  try {
    const matchParticipants = await matchParticipantsModel.getAllByMatchId({
      matchId: parseInt(matchId),
    })
    if (!matchParticipants) {
      return res.sendStatus(404)
    }

    res.status(200).send(matchParticipants)
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}

export const create: RequestHandler<
  { matchId: string },
  MatchParticipantDTO | ErrorBody,
  MatchParticipantCreationData
> = async (req, res) => {
  if (!req.params.matchId) {
    return res.sendStatus(400)
  }
  const matchId = parseInt(req.params.matchId)
  const userId = req.userId

  const participant = req.body
  const validMatchParticipant =
    validateMatchParticipantCreationData(participant)
  if (!validMatchParticipant) {
    const errorMessage = getErrorMessage(validateMatchParticipantCreationData)
    res.status(400).send({ message: errorMessage })
    return
  }

  try {
    const canUpdate = await matchesModel.checkUpdatePermission({
      id: matchId,
      userId,
    })
    if (canUpdate === undefined) {
      return res.status(404).send({ message: 'Match does not exist' })
    }
    if (!canUpdate) {
      return res.status(403).send(FORBIDDEN_ERROR)
    }

    const friendshipExists = await friendsModel.checkFriendshipExists({
      userId: req.userId,
      friend: participant.friend,
    })
    if (!friendshipExists) {
      return res.status(403).send(FORBIDDEN_ERROR)
    }

    const createdParticipant = await matchParticipantsModel.create({
      matchId,
      participant,
    })

    res.status(200).send(createdParticipant)
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}

export const update: RequestHandler<
  { matchId: string; participantId: string },
  MatchParticipantDTO | ErrorBody,
  MatchParticipantUpdateData
> = async (req, res) => {
  if (!req.params.matchId || !req.params.participantId) {
    return res.sendStatus(400)
  }
  const matchId = parseInt(req.params.matchId)
  const participantId = parseInt(req.params.participantId)
  const userId = req.userId

  const participant = req.body
  const validMatchParticipant = validateMatchParticipantUpdateData(participant)
  if (!validMatchParticipant) {
    const errorMessage = getErrorMessage(validateMatchParticipantUpdateData)
    res.status(400).send({ message: errorMessage })
    return
  }

  try {
    const canUpdate = await matchesModel.checkUpdatePermission({
      id: matchId,
      userId,
    })
    if (canUpdate === undefined) {
      return res.status(404).send({ message: 'Match does not exist' })
    }
    if (!canUpdate) {
      return res.status(403).send(FORBIDDEN_ERROR)
    }

    const friendshipExists = await friendsModel.checkFriendshipExists({
      userId,
      friend: participant.friend,
    })
    if (!friendshipExists) {
      return res.status(403).send(FORBIDDEN_ERROR)
    }

    const createdParticipant = await matchParticipantsModel.update({
      id: participantId,
      participant,
    })

    res.status(200).send(createdParticipant)
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}

export const deleteById: RequestHandler<
  { matchId: string; participantId: string },
  void | ErrorBody,
  never
> = async (req, res) => {
  if (!req.params.matchId || !req.params.participantId) {
    return res.sendStatus(400)
  }
  const matchId = parseInt(req.params.matchId)
  const participantId = parseInt(req.params.participantId)
  const userId = req.userId

  try {
    const canUpdateMatch = await matchesModel.checkUpdatePermission({
      id: matchId,
      userId,
    })
    if (canUpdateMatch === undefined) {
      return res.status(404).send({ message: 'Match does not exist' })
    }
    if (!canUpdateMatch) {
      return res.status(403).send(FORBIDDEN_ERROR)
    }

    const deleted = await matchParticipantsModel.deleteById({
      id: participantId,
      matchId,
    })
    if (!deleted) {
      return res
        .status(404)
        .send({ message: 'Match participant does not exist' })
    }

    return res.sendStatus(200)
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}
