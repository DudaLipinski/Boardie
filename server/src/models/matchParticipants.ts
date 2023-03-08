import {
  MatchParticipantCreationPayloadDTO,
  MatchParticipantDTO,
} from '../schemas/matchParticipant'
import db from '../database'
import { FriendType, prefixKeysWithDollar } from './utils'

export interface MatchParticipant {
  id: number
  matchId: string
  userId?: number | null
  anonFriendId?: number | null
  score: number
  isWinner: boolean
}
interface HydratedMatchParticipant extends MatchParticipant {
  friendFullName: string
}

const dbParticipantToDtoModel = (
  participant: HydratedMatchParticipant
): MatchParticipantDTO => ({
  id: participant.id,
  friend: {
    id: (participant.userId ?? participant.anonFriendId) as number,
    type: participant.userId ? FriendType.USER : FriendType.ANON_FRIEND,
    fullName: participant.friendFullName,
  },
  score: participant.score,
  isWinner: participant.isWinner,
})

export const getAllByMatchId = (params: { matchId: number }) => {
  const query = `
    SELECT
      mp.*,
      IIF(
          mp.userId IS NULL,
          af.fullName,
          u.firstName || ' ' || u.middleAndSurname
      ) as friendFullName
    FROM matchParticipant mp
    LEFT JOIN anonFriend af
      ON af.rowId = mp.anonFriendId
    LEFT JOIN user u
      ON u.rowId = mp.userId
    WHERE mp.matchId = $matchId
  `

  return new Promise<MatchParticipantDTO[]>((resolve, reject) => {
    db.all(
      query,
      prefixKeysWithDollar(params),
      function (error: any, participants: HydratedMatchParticipant[]) {
        if (error) {
          reject(
            `An error occurred while trying to fetch match participants by matchId: ${error?.message}`
          )
        }

        resolve(participants.map(dbParticipantToDtoModel))
      }
    )
  })
}

const participantCreationDtoToDbModel = (
  participant: MatchParticipantCreationPayloadDTO
): Omit<MatchParticipant, 'id' | 'matchId'> => ({
  score: participant.score,
  isWinner: participant.isWinner,
  anonFriendId:
    participant.friend.type === FriendType.ANON_FRIEND
      ? participant.friend.id
      : null,
  userId:
    participant.friend.type === FriendType.USER ? participant.friend.id : null,
})

// TODO: study splitting the query into multiple ones
export const createMultiple = ({
  matchId,
  participants,
}: {
  matchId: number
  participants: MatchParticipantCreationPayloadDTO[]
}) => {
  const digestedParticipants = participants.map(participantCreationDtoToDbModel)

  const valuesPlaceholders = participants.map(() => `(?, ?, ?, ?)`).join(', ')
  const query = `INSERT INTO matchParticipant(
    matchId,
    userId,
    anonFriendId,
    score
  ) VALUES ${valuesPlaceholders}`

  const values: Array<string | number | undefined | null> = []
  digestedParticipants.forEach(({ userId, anonFriendId, score }) => {
    values.push(matchId)
    values.push(userId)
    values.push(anonFriendId)
    values.push(score)
  })

  return new Promise<void>((resolve, reject) => {
    db.run(query, values, function (error) {
      if (error) {
        return reject(
          `An error occurred while creating multiple match participants: ${error?.message}`
        )
      }
    })

    resolve()
  })
}
