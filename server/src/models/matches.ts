import omit from 'lodash.omit'

import db from '../database'

export interface Match {
  id: string
  authorId: number
  boardgameName: string
  date?: string
  duration?: number
  notes?: string
}

interface DigestedParticipant {
  fullName: string
  score: number
  isWinner?: boolean
}

interface DigestedMatch extends Match {
  participants: DigestedParticipant[]
}

interface MatchWithParticipantsData extends Match {
  participantsFullNames: string
  participantsScores: string
}

const digestMatchParticipants = (match: MatchWithParticipantsData) => {
  if (!match.participantsFullNames) {
    return []
  }

  const participantsFullNames = `"${match.participantsFullNames}"`
    .split(',')
    .map((name) => name.slice(1, -1))
  const participantsScores = match.participantsScores.split(',')

  const participants: DigestedParticipant[] = participantsFullNames.map(
    (fullName, index) => {
      return { fullName, score: Number(participantsScores[index]) }
    }
  )

  const { index: winnerParticipantIndex } = participants.reduce(
    (winner, participant, index) => {
      if (winner.score === null || participant.score > winner.score) {
        return {
          index,
          score: participant.score,
        }
      }

      return winner
    },
    { index: 0, score: null } as { index: number; score: number | null }
  )

  participants[winnerParticipantIndex].isWinner = true

  return participants
}

const GET_MATCH_WITH_PARTICIPANTS_QUERY = `
  SELECT
    m.*,
    m.rowid as id,
    group_concat(mp.fullName, '","') as participantsFullNames,
    group_concat(mp.score) as participantsScores
  FROM
    \`match\` m
  JOIN matchParticipant mp
    ON m.rowid = mp.matchId
`

export const create = (match: Omit<Match, 'id'>) => {
  const query = `INSERT INTO match(
    authorId,
    boardgameName,
    date,
    duration,
    notes
  ) VALUES (?, ?, ?, ?, ?)`
  const values = [
    match.authorId,
    match.boardgameName,
    match.date,
    match.duration,
    match.notes,
  ]

  return new Promise<number>((resolve, reject) => {
    db.run(query, values, function (error) {
      if (error) {
        reject(
          `An error occurred while creating multiple match participants: ${error?.message}`
        )
      }

      resolve(this.lastID)
    })
  })
}

export const getById = ({ id }: { id: string }) => {
  const query = `
    ${GET_MATCH_WITH_PARTICIPANTS_QUERY}
    WHERE
      m.rowid = $id;
  `

  return new Promise<DigestedMatch | null>((resolve, reject) => {
    db.get(
      query,
      { $id: id },
      function (error, match: MatchWithParticipantsData) {
        if (!match.id) {
          return resolve(null)
        }

        if (error) {
          reject(
            `An error occurred while trying to fetch matches by id: ${error?.message}`
          )
        }

        const participants = digestMatchParticipants(match)
        resolve({
          ...omit(match, ['participantsFullNames', 'participantsScores']),
          participants,
        })
      }
    )
  })
}

export const getAllByAuthor = ({ authorId }: { authorId: number }) => {
  const query = `
    ${GET_MATCH_WITH_PARTICIPANTS_QUERY}
    WHERE
      m.authorId = $authorId;
  `

  return new Promise<DigestedMatch[]>((resolve, reject) => {
    db.all(
      query,
      { $authorId: authorId },
      function (error, matches: MatchWithParticipantsData[]) {
        if (error) {
          reject(
            `An error occurred while trying to fetch matches by authorId: ${error?.message}`
          )
        }

        const digestedMatches = matches
          // TODO: understand why this join is returning a nullified row when no matches are found
          .filter(({ authorId }) => authorId)
          .map((match) => {
            const participants = digestMatchParticipants(match)

            return {
              ...omit(match, ['participantsFullNames', 'participantsScores']),
              participants,
            }
          })

        resolve(digestedMatches)
      }
    )
  })
}
