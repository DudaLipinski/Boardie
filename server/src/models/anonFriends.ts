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
