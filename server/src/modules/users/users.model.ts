import { CURRENT_DATETIME_QUERY } from '../../database/database.utils'
import type { Transaction } from '../../database'
import kysely from '../../database'

export interface User {
  id: number
  firstName: string
  middleAndSurname: string
  age: number | null
  email: string
  password: string
  referredByUserId?: number | null
}

const allWithoutPassword = [
  'id',
  'firstName',
  'middleAndSurname',
  'age',
  'email',
] as const

export const create = async (
  user: Omit<User, 'id'>,
  transaction?: Transaction,
) =>
  await (transaction ?? kysely)
    .insertInto('user')
    .ignore()
    .values(user)
    .executeTakeFirst()
    .then((result) => (result.insertId ? Number(result.insertId) : undefined))

// TODO: fix this, we are now returning false when the user is not found
// and also when the credentials are wrong
export const unregister = async (
  userId: number,
  auth: Pick<User, 'email' | 'password'>,
) => {
  const result = await kysely
    .updateTable('user')
    .set({
      unregisteredAt: CURRENT_DATETIME_QUERY,
    })
    .where('id', '=', userId)
    .where('email', '=', auth.email)
    .where('password', '=', auth.password)
    .where('unregisteredAt', 'is', null)
    .executeTakeFirst()

  return result.numUpdatedRows === 1n
}

export const getById = (id: number) =>
  kysely
    .selectFrom('user')
    .select(allWithoutPassword)
    .where('id', '=', id)
    .where('unregisteredAt', 'is', null)
    .executeTakeFirst()

export const getByEmail = (email: string) =>
  kysely
    .selectFrom('user')
    .select(allWithoutPassword)
    .where('email', '=', email)
    .where('unregisteredAt', 'is', null)
    .limit(1)
    .executeTakeFirst()

export const auth = (auth: Pick<User, 'email' | 'password'>) =>
  kysely
    .selectFrom('user')
    .select(allWithoutPassword)
    .where('email', '=', auth.email)
    .where('password', '=', auth.password)
    .where('unregisteredAt', 'is', null)
    .limit(1)
    .executeTakeFirst()

export const checkExistsById = (id: number) =>
  kysely
    .selectFrom('user')
    .select('id')
    .where('id', '=', id)
    .where('unregisteredAt', 'is', null)
    .limit(1)
    .executeTakeFirst()
    .then((result) => result !== undefined)
