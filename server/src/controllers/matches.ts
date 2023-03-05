import { RequestHandler } from 'express'
import omit from 'lodash.omit'
import * as matchesModel from '../models/matches'
import * as matchParticipantModel from '../models/matchParticipants'

import {
  validateMatchCreationSchema,
  validateMatchUpdateSchema,
} from '../schemas/match'
import { getErrorMessage } from '../schemas/utils'
import { logInternalError } from '../utils/log'

export const createForLoggedUser: RequestHandler = async (req, res) => {
  const matchData = req.body
  if (!matchData) {
    return res.sendStatus(400)
  }

  const authorId = req.userId
  const matchDTO = {
    ...matchData,
    authorId,
  }

  const validMatch = validateMatchCreationSchema(matchDTO)
  if (!validMatch) {
    const errorMessage = getErrorMessage(validateMatchCreationSchema)
    res.status(400).send({ message: errorMessage })
    return
  }

  const match = omit(matchDTO, ['participants'])
  const { participants } = matchDTO

  try {
    const matchId = await matchesModel.create(match)

    await matchParticipantModel.createMultiple({ matchId, participants })

    const createdMatch = await matchesModel.getHydratedById({
      id: matchId,
    })
    res.send(omit(createdMatch, ['authorId'])).status(201)
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}

export const getAllByLoggedUser: RequestHandler = async (req, res) => {
  const { userId } = req

  try {
    const matches = await matchesModel.getHydratedByAuthor({ authorId: userId })
    res.status(200).send(matches)
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}

export const getById: RequestHandler = async (req, res) => {
  const { matchId } = req.params
  if (!matchId) {
    return res.sendStatus(400)
  }

  try {
    const match = await matchesModel.getHydratedById({ id: parseInt(matchId) })
    if (!match) {
      return res.sendStatus(404)
    }

    res.status(200).send(match)
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}

export const update: RequestHandler = async (req, res) => {
  if (!req.params.matchId) {
    return res.sendStatus(400)
  }
  const matchId = parseInt(req.params.matchId, 10)

  const matchUpdateDTO = req.body
  if (!matchUpdateDTO) {
    return res.sendStatus(400)
  }

  try {
    const match = await matchesModel.getById({ id: matchId })
    if (!match) {
      return res.sendStatus(404)
    }

    const loggedUserId = req.userId
    if (match.authorId !== loggedUserId) {
      return res.sendStatus(403)
    }

    const validMatch = validateMatchUpdateSchema(matchUpdateDTO)
    if (!validMatch) {
      const errorMessage = getErrorMessage(validateMatchUpdateSchema)
      return res.status(400).send({ message: errorMessage })
    }

    const matchUpdated = await matchesModel.update(matchId, matchUpdateDTO)
    if (!matchUpdated) {
      return res.sendStatus(404)
    }

    return res.sendStatus(200)
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}

export const deleteById: RequestHandler = async (req, res) => {
  if (!req.params.matchId) {
    return res.sendStatus(400)
  }
  const matchId = parseInt(req.params.matchId, 10)

  try {
    const match = await matchesModel.getById({ id: matchId })
    if (!match) {
      return res.sendStatus(404)
    }

    const loggedUserId = req.userId
    if (match.authorId !== loggedUserId) {
      return res.sendStatus(403)
    }

    const matchDeleted = await matchesModel.deleteById({ id: matchId })
    if (!matchDeleted) {
      return res.sendStatus(404)
    }

    res.sendStatus(200)
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}
