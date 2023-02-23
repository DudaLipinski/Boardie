import db from '../database'
import { CURRENT_DATETIME } from '../utils/sql'

const HASNT_UNREGISTERED = 'unregisteredAt IS NULL'

export interface User {
  id: string
  firstName: string
  middleAndSurname: string
  age: number
  email: string
  password: string
}

export const create = (user: Omit<User, 'id'>) => {
  const query = `INSERT INTO user(
    firstName,
    middleAndSurname,
    age,
    email,
    password
  ) VALUES (?,?,?,?,?)`

  return new Promise((resolve, reject) => {
    db.run(
      query,
      [
        user.firstName,
        user.middleAndSurname,
        user.age,
        user.email,
        user.password,
      ],
      function (error) {
        if (error) {
          reject(
            `An error occurred while trying to create an user: ${error?.message}`
          )
        }

        resolve(this.lastID)
      }
    )
  })
}

export const unregister = (
  userId: number,
  auth: Pick<User, 'email' | 'password'>
) => {
  const query = `UPDATE user
    SET unregisteredAt = ${CURRENT_DATETIME}
    WHERE
      rowId = $userId
      AND email = $email
      AND password = $password
      AND ${HASNT_UNREGISTERED}
  `

  return new Promise((resolve, reject) => {
    db.run(
      query,
      {
        $userId: userId,
        $email: auth.email,
        $password: auth.password,
      },
      function (error) {
        if (error) {
          reject(
            `An error occurred while trying to unregister an user: ${error?.message}`
          )
        }

        resolve(this.changes && this.changes > 0)
      }
    )
  })
}

export const getById = (id: number) => {
  const query = `SELECT
    rowId as id,
    firstName,
    middleAndSurname,
    age,
    email
  FROM user
    WHERE
      rowId = $id
      AND ${HASNT_UNREGISTERED}
    LIMIT 1
  `

  return new Promise((resolve, reject) => {
    db.get(
      query,
      {
        $id: id,
      },
      function (error, user) {
        if (error) {
          reject(
            `An error occurred while trying to fetch an user by id: ${error?.message}`
          )
        }

        resolve(user)
      }
    )
  })
}

export const getByEmail = (email: string) => {
  const query = `SELECT * FROM user
    WHERE
      email = $email
      AND ${HASNT_UNREGISTERED}
    LIMIT 1
  `

  return new Promise((resolve, reject) => {
    db.get(
      query,
      {
        $email: email,
      },
      function (error, user) {
        if (error) {
          reject(
            `An error occurred while trying to fetch an user by email: ${error?.message}`
          )
        }

        resolve(user)
      }
    )
  })
}

export const auth = (auth: Pick<User, 'email' | 'password'>) => {
  const query = `SELECT rowId id, firstName, middleAndSurname, age, email
    FROM user
    WHERE
      email = $email
      AND password = $password
      AND ${HASNT_UNREGISTERED}
    LIMIT 1
  `

  return new Promise<User>((resolve, reject) => {
    db.get(
      query,
      {
        $email: auth.email,
        $password: auth.password,
      },
      function (error, user) {
        if (error) {
          return reject(
            `An error occurred while trying to auth: ${error?.message}`
          )
        }

        resolve(user)
      }
    )
  })
}
