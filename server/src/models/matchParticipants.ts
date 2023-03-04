import db from '../database'
import { FriendType, prefixKeysWithDollar } from './utils'

export interface MatchParticipant {
  id: string
  matchId: string
  userId?: number
  anonFriendId?: number
  score: number
  isWinner?: boolean
}

export interface MatchParticipantDTO {
  id: number
  type: FriendType
  fullName: string
  score: number
  isWinner?: boolean
}

const getWinnerIndex = (participants: MatchParticipantDTO[]) =>
  participants.reduce(
    (result, { score }, index) => {
      if (score > result.score) {
        return { index, score }
      }
      return result
    },
    { index: 0, score: -Infinity } as {
      index: number
      score: number
    }
  ).index

export const getAllByMatchId = (params: { matchId: number }) => {
  const query = `
    SELECT
      mp.score,
      IIF(
          mp.userId IS NULL,
          mp.anonFriendId ,
          mp.userId
      ) as id,
      IIF(
          mp.userId IS NULL,
          '${FriendType.ANON_FRIEND}',
          '${FriendType.USER}'
      ) as type,
      IIF(
          mp.userId IS NULL,
          af.fullName,
          u.firstName || ' ' || u.middleAndSurname
      ) as fullName
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
      function (error: any, participants: MatchParticipantDTO[]) {
        if (error) {
          reject(
            `An error occurred while trying to fetch match participants by matchId: ${error?.message}`
          )
        }

        const winnerIndex = getWinnerIndex(participants)
        participants[winnerIndex].isWinner = true

        resolve(participants)
      }
    )
  })
}

const dtoParticipantToDbModel = (
  participant: Omit<MatchParticipantDTO, 'fullName'>
): Omit<MatchParticipant, 'id' | 'matchId'> => ({
  score: participant.score,
  isWinner: participant.isWinner,
  anonFriendId:
    participant.type === FriendType.ANON_FRIEND ? participant.id : undefined,
  userId: participant.type === FriendType.USER ? participant.id : undefined,
})

// TODO: study splitting the query into multiple ones
export const createMultiple = ({
  matchId,
  participants,
}: {
  matchId: number
  participants: Omit<MatchParticipantDTO, 'fullName'>[]
}) => {
  const digestedParticipants = participants.map(dtoParticipantToDbModel)

  const valuesPlaceholders = participants.map(() => `(?, ?, ?, ?)`).join(', ')
  const query = `INSERT INTO matchParticipant(
    matchId,
    userId,
    anonFriendId,
    score
  ) VALUES ${valuesPlaceholders}`

  const values: Array<string | number | undefined> = []
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
