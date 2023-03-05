import db from '../database'
import { prefixKeysWithDollar } from './utils'
import { CURRENT_DATETIME } from '../utils/sql'
import { MatchParticipantDTO, getAllByMatchId } from './matchParticipants'

const ISNT_DELETED = 'deletedAt IS NULL'

export interface Match {
  id: number
  authorId: number
  boardgameName: string
  startedAt?: string
  endedAt?: string
  duration?: number
  notes?: string
}

interface HydratedMatch extends Match {
  participants: MatchParticipantDTO[]
}

export const create = (match: Omit<Match, 'id'>) => {
  const query = `INSERT INTO match(
    authorId,
    boardgameName,
    startedAt,
    endedAt,
    duration,
    notes
  ) VALUES (?, ?, ?, ?, ?, ?)`
  const values = [
    match.authorId,
    match.boardgameName,
    match.startedAt,
    match.endedAt,
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

export const getHydratedById = ({ id }: { id: number }) => {
  const query = `
    SELECT
      m.*,
      m.rowId as id
    FROM match m
    WHERE
      m.rowId = $id
      AND ${ISNT_DELETED};
  `

  return new Promise<HydratedMatch | null>((resolve, reject) => {
    db.get(query, { $id: id }, async function (error, match: Match) {
      if (!match.id) {
        return resolve(null)
      }

      if (error) {
        reject(
          `An error occurred while trying to fetch a match and its participants by id: ${error?.message}`
        )
      }

      try {
        const participants = await getAllByMatchId({ matchId: match.id })
        resolve({
          ...match,
          participants,
        })
      } catch (e: any) {
        reject(e)
      }
    })
  })
}

export const getHydratedByAuthor = (params: { authorId: number }) => {
  const query = `
    SELECT
      rowId as id,
      boardgameName,
      startedAt,
      endedAt,
      duration
    FROM match
    WHERE
      authorId = $authorId
      AND ${ISNT_DELETED}
  `

  return new Promise<HydratedMatch[]>((resolve, reject) => {
    db.all(
      query,
      prefixKeysWithDollar(params),
      async function (error: Error | null, matches: Match[]) {
        if (error) {
          reject(
            `An error occurred while trying to fetch matches by authorId: ${error?.message}`
          )
        }

        try {
          /**
           * We are fine with this N+1 query since the server and the database
           * will be running within the same machine, with low latency
           */
          const result: HydratedMatch[] = []
          for (const match of matches) {
            const participants = await getAllByMatchId({ matchId: match.id })
            result.push({
              ...match,
              participants,
            })
          }

          resolve(result)
        } catch (e: any) {
          reject(e)
        }
      }
    )
  })
}

export const getById = (params: { id: number }) => {
  const query = `
    SELECT
      rowId as id,
      *
    FROM match
    WHERE
      rowId = $id
      AND ${ISNT_DELETED};
  `

  return new Promise<Match | null>((resolve, reject) => {
    db.get(
      query,
      prefixKeysWithDollar(params),
      function (error: any, match: Match) {
        if (!match) {
          return resolve(null)
        }

        if (error) {
          return reject(
            `An error occurred while trying to fetch a match by id: ${error?.message}`
          )
        }

        resolve(match)
      }
    )
  })
}

export const deleteById = (params: { id: number }) => {
  const query = `
    UPDATE match
    SET deletedAt = ${CURRENT_DATETIME}
    WHERE
      rowId = $id
      AND ${ISNT_DELETED};
  `

  return new Promise<boolean>((resolve, reject) => {
    db.run(query, prefixKeysWithDollar(params), function (error) {
      if (error) {
        return reject(
          `An error occurred while trying to delete a match: ${error?.message}`
        )
      }

      resolve(!!this.changes && this.changes > 0)
    })
  })
}
