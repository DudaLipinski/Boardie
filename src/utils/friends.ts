import { GenericUser } from '../types/GenericUser'
import { Player } from '../types/Match'
import { User } from '../types/User'

export const userToGeneric = (user: User): GenericUser => {
  return {
    id: +user.id,
    fullName: `${user.firstName} ${user.middleAndSurname}`,
    type: 'USER' as const,
  }
}

export const userToPlayer = (user: User): Player => {
  return {
    score: 0,
    isWinner: false,
    friend: userToGeneric(user),
  }
}
