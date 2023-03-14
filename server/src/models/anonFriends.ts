import db from '../database'
import { prefixKeysWithDollar } from './utils'

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

  return new Promise<number>((resolve, reject) => {
    db.run(query, prefixKeysWithDollar(anonFriend), function (error) {
      if (error) {
        reject(
          `An error occurred while creating an anon friend: ${error?.message}`
        )
      }

      resolve(this.lastID)
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
    SELECT userId FROM anonFriend
    WHERE
      rowId = $id
    LIMIT 1
  `

  return new Promise<boolean | undefined>((resolve, reject) => {
    db.get(query, prefixKeysWithDollar({ id }), function (error, anonFriend) {
      if (error) {
        return reject(
          `An error occurred while checking update permission for an anon friend: ${error?.message}`
        )
      }

      resolve(anonFriend ? anonFriend.userId === userId : undefined)
    })
  })
}

export function update(
  id: AnonFriend['id'],
  params: { fullName: AnonFriend['fullName'] }
) {
  const query = `
    UPDATE anonFriend
    SET
      fullName = $fullName
    WHERE
      rowId = $id
  `

  return new Promise<void>((resolve, reject) => {
    db.run(query, prefixKeysWithDollar({ id, ...params }), function (error) {
      if (error) {
        reject(
          `An error occurred while updating an anon friend: ${error?.message}`
        )
      }

      resolve()
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

  return new Promise<Omit<AnonFriend, 'userId'>[]>((resolve, reject) => {
    db.all(
      query,
      prefixKeysWithDollar(params),
      function (error: Error, friends: Omit<AnonFriend, 'userId'>[]) {
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

export const checkFriendshipExists = async (params: {
  userId: number
  id: number
}) => {
  const query = `
    SELECT EXISTS(
      SELECT 1 FROM anonFriend
      WHERE
        rowId = $id
        AND userId = $userId
      LIMIT 1
    );
  `

  return new Promise<boolean>((resolve, reject) => {
    db.get(query, prefixKeysWithDollar(params), function (error, result) {
      if (error) {
        reject(
          `An error occurred while trying to check if an anon friendship exists: ${error?.message}`
        )
      }

      const isFriend = Object.values(result)[0] === 1
      resolve(isFriend)
    })
  })
}
