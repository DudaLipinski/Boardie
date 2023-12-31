export const LOGIN = '/login'

export const SIGNUP = '/signup'
export const SIGNUP_ANON_FRIEND_INVITE_TOKEN_PARAM = 'anonFriendInviteToken'
export const getSignupRouteWithAnonFriendInviteToken = (token: string) =>
  `${SIGNUP}?${SIGNUP_ANON_FRIEND_INVITE_TOKEN_PARAM}=${encodeURIComponent(
    token
  )}`

export const PROFILE = '/profile'
export const DASHBOARD = '/dashboard'
export const FRIENDS = '/friends'
export const CREATE_MATCH = '/create-match'
export const EDIT_MATCH = '/edit-match/:id'
export const MATCHES = '/matches'
export const MATCH_DETAILS = '/match/:id'
export const FRIENDSHIP_REQUESTS = '/friends/requests'
