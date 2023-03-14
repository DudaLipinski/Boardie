import db from '../database'
import { generateUpdate, prefixKeysWithDollar } from './utils'
import { CURRENT_DATETIME } from '../utils/sql'
import { getAllByMatchId } from './matchParticipants'
import { MatchUpdateDTO } from '../schemas/match'
import { MatchParticipantDTO } from '../schemas/matchParticipant'

const ISNT_DELETED = 'deletedAt IS NULL'

export interface Match {
  id: number
  authorId: number
  boardgameName: string
  location?: string | null
  startedAt?: string
  endedAt?: string
  notes?: string
}

export interface HydratedMatch extends Match {
  participants: MatchParticipantDTO[]
}

export const create = (match: Omit<Match, 'id'>) => {
  const query = `INSERT INTO match(
    authorId,
    boardgameName,
    startedAt,
    endedAt,
    location,
    notes
  ) VALUES (
    $authorId,
    $boardgameName,
    $startedAt,
    $endedAt,
    $location,
    $notes
  )`

  return new Promise<number>((resolve, reject) => {
    db.run(query, prefixKeysWithDollar(match), function (error) {
      if (error) {
        reject(`An error occurred while creating a match: ${error?.message}`)
      }

      resolve(this.lastID)
    })
  })
}

export const update = (matchId: number, match: MatchUpdateDTO) => {
  const { fieldAssignments, params } = generateUpdate(match)
  const query = `
    UPDATE match
    SET
      ${fieldAssignments}
    WHERE
      rowId = $matchId
  `

  return new Promise<boolean>((resolve, reject) => {
    db.run(
      query,
      {
        ...params,
        $matchId: matchId,
      },
      function (error) {
        if (error) {
          reject(
            `An error occurred while trying to update a match: ${error?.message}`
          )
        }

        resolve(this.changes === 1)
      }
    )
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
      } catch (e) {
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
      location
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
        } catch (e) {
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
      function (error: Error | null, match: Match) {
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

export const checkUpdatePermission = ({
  id,
  userId,
}: {
  id: number
  userId: number
}) => {
  const query = `
    SELECT authorId FROM match
    WHERE
      rowId = $id
      AND ${ISNT_DELETED}
    LIMIT 1
  `

  return new Promise<boolean | undefined>((resolve, reject) => {
    db.get(query, prefixKeysWithDollar({ id }), function (error, match) {
      if (error) {
        return reject(
          `An error occurred while trying to check if a user can update a match: ${error?.message}`
        )
      }

      resolve(match ? match.authorId === userId : undefined)
    })
  })
}

export const checkDeletePermission = checkUpdatePermission
