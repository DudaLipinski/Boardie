import omit from 'lodash.omit'
import * as matchesModel from '../models/matches'
import * as matchParticipantModel from '../models/matchParticipants'

import type {
  MatchCreationData,
  MatchDTO,
  MatchUpdateData,
} from '../schemas/match'
import {
  matchUpdateDataSchema,
  matchCreationData,
  matchDTOSchema,
} from '../schemas/match'
import { endpoint } from '../utils/endpoint'

export const createForLoggedUser = endpoint.POST('/me/matches')<
  void,
  MatchCreationData,
  MatchDTO
>(
  async (req, res) => {
    const matchCreationData = req.body

    const match = {
      ...omit(matchCreationData, ['participants']),
      authorId: req.userId,
    }
    const matchId = await matchesModel.create(match)

    const { participants } = matchCreationData
    await matchParticipantModel.createMultiple({ matchId, participants })

    const createdMatch = await matchesModel.getHydratedById({
      id: matchId,
    })
    if (!createdMatch) {
      return res.sendStatus(500)
    }

    res.status(201).send(createdMatch)
  },
  {
    summary: 'Creates a match for the logged user',
    tags: ['matches'],
    params: null,
    body: matchCreationData,
    responses: {
      201: {
        description: 'The created match',
        schema: matchDTOSchema,
      },
    },
  }
)

export const getAllByLoggedUser = endpoint.GET('/me/matches')<
  void,
  void,
  MatchDTO[]
>(
  async (req, res) => {
    const matches = await matchesModel.getHydratedByAuthor({
      authorId: req.userId,
    })
    res.status(200).send(matches)
  },
  {
    summary: 'Gets all the matches for the logged user',
    tags: ['matches'],
    params: null,
    body: null,
    responses: {
      200: {
        description: 'The matches',
        schema: {
          type: 'array',
          items: matchDTOSchema,
        },
      },
    },
  }
)

// TODO: implement access logic
export const getById = endpoint.GET('/matches/:matchId')<
  { matchId: string },
  void,
  MatchDTO
>(
  async (req, res) => {
    const { matchId } = req.params
    const match = await matchesModel.getHydratedById({ id: parseInt(matchId) })
    if (!match) {
      return res.sendStatus(404)
    }

    res.status(200).send(match)
  },
  {
    summary: 'Gets a match by id',
    tags: ['matches'],
    params: {
      matchId: {
        type: 'string',
        description: 'The id of the match',
      },
    },
    body: null,
    responses: {
      200: {
        description: 'The match',
        schema: matchDTOSchema,
      },
      404: {
        description: 'The match was not found',
      },
    },
  }
)

export const update = endpoint.PUT('/matches/:matchId')<
  { matchId: string },
  MatchUpdateData,
  void
>(
  async (req, res) => {
    const matchId = parseInt(req.params.matchId, 10)

    const match = await matchesModel.getById({ id: matchId })
    if (!match) {
      return res.sendStatus(404)
    }

    const loggedUserId = req.userId
    if (match.authorId !== loggedUserId) {
      return res.sendStatus(403)
    }

    const matchUpdated = await matchesModel.update(matchId, req.body)
    if (!matchUpdated) {
      return res.sendStatus(404)
    }

    return res.sendStatus(200)
  },
  {
    summary: 'Updates a match',
    tags: ['matches'],
    params: {
      matchId: {
        type: 'string',
        description: 'The id of the match',
      },
    },
    body: matchUpdateDataSchema,
    responses: {
      200: {
        description: 'The match was updated',
      },
      403: {
        description: 'The logged user is not the author of the match',
      },
      404: {
        description: 'The match was not found',
      },
    },
  }
)

export const deleteById = endpoint.DELETE('/matches/:matchId')<
  { matchId: string },
  void,
  void
>(
  async (req, res) => {
    const matchId = parseInt(req.params.matchId, 10)

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
  },
  {
    summary: 'Deletes a match',
    tags: ['matches'],
    params: {
      matchId: {
        type: 'string',
        description: 'The id of the match',
      },
    },
    body: null,
    responses: {
      200: {
        description: 'The match was deleted',
      },
      403: {
        description: 'The logged user is not the author of the match',
      },
      404: {
        description: 'The match was not found',
      },
    },
  }
)
