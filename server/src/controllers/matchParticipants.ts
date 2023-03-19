import * as matchesModel from '../models/matches'
import * as matchParticipantsModel from '../models/matchParticipants'
import * as friendsModel from '../models/friends'
import type {
  MatchParticipantCreationData,
  MatchParticipantDTO,
  MatchParticipantUpdateData,
} from '../schemas/matchParticipant'
import {
  matchParticipantDTOSchema,
  matchParticipantCreationDataSchema,
  matchParticipantUpdateDataSchema,
} from '../schemas/matchParticipant'
import { endpoint } from '../utils/endpoint'

// TODO: implement access logic
export const getAllByMatchId = endpoint.GET('/matches/:matchId/participants')<
  { matchId: string },
  void,
  MatchParticipantDTO[]
>(
  async (req, res) => {
    const { matchId } = req.params

    const matchExists = await matchesModel.checkIfExists({
      id: parseInt(matchId),
    })
    if (!matchExists) {
      return res.sendStatus(404)
    }

    const matchParticipants = await matchParticipantsModel.getAllByMatchId({
      matchId: parseInt(matchId),
    })
    res.status(200).send(matchParticipants)
  },
  {
    summary: 'Gets all match participants by match id',
    tags: ['matches/participants'],
    params: {
      matchId: {
        type: 'string',
        description: 'The id of the match',
      },
    },
    body: null,
    responses: {
      200: {
        description: 'The match participants',
        schema: {
          type: 'array',
          items: matchParticipantDTOSchema,
        },
      },
      404: {
        description: 'The match was not found',
      },
    },
  }
)

export const create = endpoint.POST('/matches/:matchId/participants')<
  { matchId: string },
  MatchParticipantCreationData,
  MatchParticipantDTO
>(
  async (req, res) => {
    const matchId = parseInt(req.params.matchId)
    const userId = req.userId
    const participant = req.body

    const canUpdate = await matchesModel.checkUpdatePermission({
      id: matchId,
      userId,
    })
    if (canUpdate === undefined) {
      return res.status(404).send({ message: 'Match not found' })
    }
    if (!canUpdate) {
      return res.sendStatus(403)
    }

    const friendshipExists = await friendsModel.checkFriendshipExists({
      userId,
      friend: participant.friend,
    })
    if (!friendshipExists) {
      return res.sendStatus(403)
    }

    const createdParticipant = await matchParticipantsModel.create({
      matchId,
      participant,
    })

    res.status(200).send(createdParticipant)
  },
  {
    summary: 'Creates a match participant',
    tags: ['matches/participants'],
    params: {
      matchId: {
        type: 'string',
        description: 'The id of the match',
      },
    },
    body: matchParticipantCreationDataSchema,
    responses: {
      200: {
        description: 'The created match participant',
        schema: matchParticipantDTOSchema,
      },
      403: {
        description:
          "The user doesn't have permissions to update the match, or doesn't have a friendship with the friend related to the match participant trying to be created",
      },
      404: {
        description: 'The match was not found',
      },
    },
  }
)

export const update = endpoint.PUT(
  '/matches/:matchId/participants/:participantId'
)<
  { matchId: string; participantId: string },
  MatchParticipantUpdateData,
  MatchParticipantDTO
>(
  async (req, res) => {
    const matchId = parseInt(req.params.matchId)
    const participantId = parseInt(req.params.participantId)
    const userId = req.userId
    const participant = req.body

    const exists = await matchParticipantsModel.checkIfExists({
      id: participantId,
    })
    if (!exists) {
      return res.status(404).send({ message: 'Match participant not found' })
    }

    // We shouldn't be relying on the matchId from the URL,
    // we should instead check if the participant belongs to the match
    const canUpdate = await matchesModel.checkUpdatePermission({
      id: matchId,
      userId,
    })
    if (canUpdate === undefined) {
      return res.status(404).send({ message: 'Match not found' })
    }
    if (!canUpdate) {
      return res.sendStatus(403)
    }

    const friendshipExists = await friendsModel.checkFriendshipExists({
      userId,
      friend: participant.friend,
    })
    if (!friendshipExists) {
      return res.sendStatus(403)
    }

    const updatedParticipant = await matchParticipantsModel.update({
      id: participantId,
      participant,
    })

    res.status(200).send(updatedParticipant)
  },
  {
    summary: 'Updates a match participant',
    tags: ['matches/participants'],
    params: {
      matchId: {
        type: 'string',
        description: 'The id of the match that contains the participant',
      },
      participantId: {
        type: 'string',
        description: 'The id of the match participant',
      },
    },
    body: matchParticipantUpdateDataSchema,
    responses: {
      200: {
        description: 'The updated match participant',
        schema: matchParticipantDTOSchema,
      },
      403: {
        description:
          "The user doesn't have permissions to update the match, or doesn't have a friendship with the friend related to the match participant trying to be updated",
      },
      404: {
        description: 'The match or match participant was not found',
      },
    },
  }
)

export const deleteById = endpoint.DELETE(
  '/matches/:matchId/participants/:participantId'
)<{ matchId: string; participantId: string }, void, void>(
  async (req, res) => {
    const matchId = parseInt(req.params.matchId)
    const participantId = parseInt(req.params.participantId)
    const userId = req.userId

    const exists = await matchParticipantsModel.checkIfExists({
      id: participantId,
    })
    if (!exists) {
      return res.status(404).send({ message: 'Match participant not found' })
    }

    // We shouldn't be relying on the matchId from the URL,
    // we should instead check if the participant belongs to the match
    const canUpdateMatch = await matchesModel.checkUpdatePermission({
      id: matchId,
      userId,
    })
    if (canUpdateMatch === undefined) {
      return res.status(404).send({ message: 'Match not found' })
    }
    if (!canUpdateMatch) {
      return res.sendStatus(403)
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
  },
  {
    summary: 'Deletes a match participant by id',
    tags: ['matches/participants'],
    params: {
      matchId: {
        type: 'string',
        description: 'The id of the match that contains the participant',
      },
      participantId: {
        type: 'string',
        description: 'The id of the match participant',
      },
    },
    body: null,
    responses: {
      200: {
        description: 'The match participant was deleted',
      },
      403: {
        description: "The user doesn't have permissions to update the match",
      },
      404: {
        description: 'The match or match participant was not found',
      },
    },
  }
)
