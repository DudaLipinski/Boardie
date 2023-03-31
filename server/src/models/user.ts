import { CURRENT_DATETIME_QUERY } from '../utils/sql'
import kysely from '../database'

export interface User {
  id: number
  firstName: string
  middleAndSurname: string
  age: number | null
  email: string
  password: string
}

export const create = async (user: Omit<User, 'id'>) => {
  const result = await kysely
    .insertInto('user')
    .values(user)
    .returning('id')
    .onConflict((u) => u.column('email').doNothing())
    .executeTakeFirst()

  return result?.id
}

// TODO: fix this, we are now returning false when the user is not found
// and also when the credentials are wrong
export const unregister = async (
  userId: number,
  auth: Pick<User, 'email' | 'password'>
) => {
  const result = await kysely
    .updateTable('user')
    .set({
      unregisteredAt: CURRENT_DATETIME_QUERY,
    })
    .where('id', '==', userId)
    .where('email', '==', auth.email)
    .where('password', '==', auth.password)
    .where('unregisteredAt', 'is', null)
    .executeTakeFirst()

  return result.numUpdatedRows === 1n
}

export const getById = (id: number) =>
  kysely
    .selectFrom('user')
    .select(['id', 'firstName', 'middleAndSurname', 'age', 'email'])
    .where('id', '==', id)
    .where('unregisteredAt', 'is', null)
    .executeTakeFirst()

export const getByEmail = (email: string) =>
  kysely
    .selectFrom('user')
    .select(['id', 'firstName', 'middleAndSurname', 'age', 'email'])
    .where('email', '==', email)
    .where('unregisteredAt', 'is', null)
    .limit(1)
    .executeTakeFirst()

export const auth = (auth: Pick<User, 'email' | 'password'>) =>
  kysely
    .selectFrom('user')
    .select(['id', 'firstName', 'middleAndSurname', 'age', 'email'])
    .where('email', '==', auth.email)
    .where('password', '==', auth.password)
    .where('unregisteredAt', 'is', null)
    .limit(1)
    .executeTakeFirst()
