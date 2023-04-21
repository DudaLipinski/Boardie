import { getRandomNumber } from '../../utils/schema.mocks.utils'
import type { UserCreationData } from './users.schema'

export const getCreationData = (
  params?: UserCreationData
): UserCreationData => {
  const hash = getRandomNumber()
  return {
    firstName: 'Mocked',
    middleAndSurname: `User ${hash}`,
    age: getRandomNumber(80, 1),
    email: `mocked_${hash}@gmail.com`,
    password: `pass_${hash}`,
    ...params,
  }
}
