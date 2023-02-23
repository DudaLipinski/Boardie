import db from '../database'
import { prepareParameters } from './utils'

export interface AnonFriend {
  id: number
  fullName: string
  userId: number
}

export function create(anonFriend: Omit<AnonFriend, 'id'>) {
  const query = `
    INSERT INTO anonFriend(
      userId,
      fullName
    ) VALUES (
      $userId,
      $fullName
    )
  `

  return new Promise((resolve, reject) => {
    db.run(query, prepareParameters(anonFriend), function (error) {
      if (error) {
        reject(
          `An error occurred while creating an anon friend: ${error?.message}`
        )
      }

      resolve(this.lastID)
    })
  })
}

export function getAllByUserId(params: { userId: number }) {
  const query = `
      SELECT
        rowId as id,
        fullName
      FROM anonFriend
      WHERE
        userId = $userId;
    `

  return new Promise<AnonFriend[]>((resolve, reject) => {
    db.all(
      query,
      prepareParameters(params),
      function (error: any, friends: AnonFriend[]) {
        if (error) {
          reject(
            `An error occurred while trying to fetch anon friends by userId: ${error?.message}`
          )
        }

        resolve(friends)
      }
    )
  })
}
