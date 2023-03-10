import { Match } from '../types/Match'
import { User } from '../types/User'
import { GenericUser } from '../types/GenericUser'

const SET_USER = 'SET_USER'
const SET_MATCHES = 'SET_MATCHES'
const SET_FRIENDS = 'SET_FRIENDS'

const INITIAL_STATE = null

export const reducer = (
  state = INITIAL_STATE,
  action: { type: any; payload: any }
) => {
  switch (action.type) {
    case SET_USER:
      return action.payload
    case SET_MATCHES:
      return {
        ...(typeof state === 'object' ? state : {}),
        matches: action.payload,
      }
    case SET_FRIENDS:
      return {
        ...(typeof state === 'object' ? state : {}),
        friends: action.payload,
      }
    default:
      return state
  }
}

export const actions = {
  setUser: (user: User) => ({ type: SET_USER, payload: user }),
  setMatches: (matches: Match[]) => ({ type: SET_MATCHES, payload: matches }),
  setFriends: (friends: GenericUser[]) => ({
    type: SET_FRIENDS,
    payload: friends,
  }),
}

export const selectors = {
  getUser: (state: { user: User }) => state.user,
  getUserId: (state: { user: { id: string } }) => state.user.id,
  getIsLoggedIn: (state: { user: User }) => !!state.user,
  getUserMatches: (state: { user: { matches: Match[] } }) => state.user.matches,
  getUserFriends: (state: { user: { friends: GenericUser[] } }) =>
    state.user.friends,
}
