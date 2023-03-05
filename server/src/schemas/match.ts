import ajv from './ajv'
import { JSONSchemaType } from 'ajv'
import { MatchParticipantDTO } from '../models/matchParticipants'
import { Match } from '../models/matches'
import { FriendType } from '../models/utils'

export type MatchCreationParticipantData = Omit<MatchParticipantDTO, 'fullName'>
export interface MatchCreationDTO extends Omit<Match, 'id'> {
  participants: MatchCreationParticipantData[]
}
const matchCreationSchema: JSONSchemaType<MatchCreationDTO> = {
  title: 'Match',
  description: 'Match data with its participants',
  type: 'object',
  properties: {
    authorId: { type: 'number' },
    boardgameName: { type: 'string' },
    startedAt: { type: 'string', isoUtcDateTime: true, nullable: true },
    endedAt: { type: 'string', isoUtcDateTime: true, nullable: true },
    duration: { type: 'number', nullable: true },
    notes: { type: 'string', nullable: true },
    participants: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          type: {
            type: 'string',
            enum: [FriendType.USER, FriendType.ANON_FRIEND],
          },
          score: { type: 'number' },
          isWinner: { type: 'boolean', nullable: true },
        },
        required: ['id', 'type', 'score'],
        additionalProperties: false,
      },
    },
  },
  required: ['authorId', 'boardgameName', 'participants'],
  additionalProperties: false,
}
export const validateMatchCreationSchema = ajv.compile(matchCreationSchema)

export type MatchUpdateDTO = Omit<Match, 'id' | 'authorId'>
const matchUpdateSchema: JSONSchemaType<MatchUpdateDTO> = {
  title: 'Match',
  description: 'Match data with its participants',
  type: 'object',
  properties: {
    boardgameName: { type: 'string' },
    startedAt: { type: 'string', isoUtcDateTime: true, nullable: true },
    endedAt: { type: 'string', isoUtcDateTime: true, nullable: true },
    duration: { type: 'number', nullable: true },
    notes: { type: 'string', nullable: true },
  },
  required: ['boardgameName'],
  additionalProperties: false,
}
export const validateMatchUpdateSchema = ajv.compile(matchUpdateSchema)
