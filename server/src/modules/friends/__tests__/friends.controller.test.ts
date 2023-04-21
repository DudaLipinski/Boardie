/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AnonFriendDTO } from '../anonFriends/anonFriends.schema'
import type { FriendshipRequest, GenericFriend } from '../friends.schema'
import type { UserDTO } from '../../users/users.schema'
import { SERVER_URL } from '../../../utils/testing.utils'
import { createAnonFriend } from '../anonFriends/anonFriends.controllers.mocks'
import { createFriendship } from '../friends.controller.mocks'
import { createUser } from '../../users/users.controller.mocks'

const getRequestingAndAnsweringUserPair = async () => ({
  requestingUser: await createUser(),
  answeringUser: await createUser(),
})

const checkFriendRequestComesFromUser =
  (user: UserDTO) => (friendshipRequest: FriendshipRequest) =>
    friendshipRequest.userId === user.id &&
    friendshipRequest.fullName === `${user.firstName} ${user.middleAndSurname}`

const checkFriendMatchesUser = (user: UserDTO) => (friend: GenericFriend) =>
  friend.type === 'USER' &&
  friend.id === user.id &&
  friend.fullName === `${user.firstName} ${user.middleAndSurname}`

const checkFriendMatchesAnonFriend =
  (anonFriend: AnonFriendDTO) => (friend: GenericFriend) =>
    friend.type === 'ANON_FRIEND' &&
    friend.id === anonFriend.id &&
    friend.fullName === anonFriend.fullName

describe('POST /me/friends/requests', () => {
  it('200 - creates a friendship request', async () => {
    const { requestingUser, answeringUser } =
      await getRequestingAndAnsweringUserPair()

    await axios.post(
      `${SERVER_URL}/me/friends/requests`,
      { userEmail: answeringUser.data.email },
      requestingUser.auth
    )
    expect(
      (
        await axios.get(`${SERVER_URL}/me/friends/requests`, answeringUser.auth)
      ).data.some(checkFriendRequestComesFromUser(requestingUser.data))
    ).toBeTruthy()
  })

  test('404 - when no user was found with the given email', async () => {
    const requestingUser = await createUser()

    await axios
      .post(
        `${SERVER_URL}/me/friends/requests`,
        { userEmail: 'non@existent.email' },
        requestingUser.auth
      )
      .then(() => {
        throw new Error('Should have thrown a 404 error')
      })
      .catch((error) => {
        expect(error.response.status).toBe(404)
      })
  })

  test('409 - when the user is already friends with the given user', async () => {
    const { requestingUser, answeringUser } =
      await getRequestingAndAnsweringUserPair()

    await createFriendship({ requestingUser, answeringUser })

    await axios
      .post(
        `${SERVER_URL}/me/friends/requests`,
        { userEmail: answeringUser.data.email },
        requestingUser.auth
      )
      .then(() => {
        throw new Error('Should have thrown a 409 error')
      })
      .catch((error) => {
        expect(error.response.status).toBe(409)
      })
  })

  test('409 - when the user has already sent a friendship request to the given user', async () => {
    const { requestingUser, answeringUser } =
      await getRequestingAndAnsweringUserPair()

    await axios.post(
      `${SERVER_URL}/me/friends/requests`,
      { userEmail: answeringUser.data.email },
      requestingUser.auth
    )

    await axios
      .post(
        `${SERVER_URL}/me/friends/requests`,
        { userEmail: answeringUser.data.email },
        requestingUser.auth
      )
      .then(() => {
        throw new Error('Should have thrown a 409 error')
      })
      .catch((error) => {
        expect(error.response.status).toBe(409)
      })
  })
})

describe('GET /me/friends/requests', () => {
  it('200 - gets all friendship requests', async () => {
    const { requestingUser, answeringUser } =
      await getRequestingAndAnsweringUserPair()
    const secondRequestingUser = await createUser()

    await axios.post(
      `${SERVER_URL}/me/friends/requests`,
      { userEmail: answeringUser.data.email },
      requestingUser.auth
    )
    await axios.post(
      `${SERVER_URL}/me/friends/requests`,
      { userEmail: answeringUser.data.email },
      secondRequestingUser.auth
    )

    const { data: friendRequests } = await axios.get(
      `${SERVER_URL}/me/friends/requests`,
      answeringUser.auth
    )
    expect(
      friendRequests.some(checkFriendRequestComesFromUser(requestingUser.data))
    ).toBeTruthy()
    expect(
      friendRequests.some(
        checkFriendRequestComesFromUser(secondRequestingUser.data)
      )
    ).toBeTruthy()
  })
})

describe('PUT /me/friends/requests/:userId', () => {
  it('200 - accepts a friendship request', async () => {
    const { requestingUser, answeringUser } =
      await getRequestingAndAnsweringUserPair()
    await axios.post(
      `${SERVER_URL}/me/friends/requests`,
      { userEmail: answeringUser.data.email },
      requestingUser.auth
    )

    await axios.put(
      `${SERVER_URL}/me/friends/requests/${requestingUser.data.id}`,
      { accept: true },
      answeringUser.auth
    )

    expect(
      (
        await axios.get(`${SERVER_URL}/me/friends/requests`, answeringUser.auth)
      ).data.some(checkFriendRequestComesFromUser(requestingUser.data))
    ).toBeFalsy()
    expect(
      (
        await axios.get(`${SERVER_URL}/me/friends`, answeringUser.auth)
      ).data.some(checkFriendMatchesUser(requestingUser.data))
    ).toBeTruthy()
    expect(
      (
        await axios.get(`${SERVER_URL}/me/friends`, requestingUser.auth)
      ).data.some(checkFriendMatchesUser(answeringUser.data))
    ).toBeTruthy()
  })

  it('200 - rejects a friendship request', async () => {
    const { requestingUser, answeringUser } =
      await getRequestingAndAnsweringUserPair()
    await axios.post(
      `${SERVER_URL}/me/friends/requests`,
      { userEmail: answeringUser.data.email },
      requestingUser.auth
    )

    await axios.put(
      `${SERVER_URL}/me/friends/requests/${requestingUser.data.id}`,
      { accept: false },
      answeringUser.auth
    )

    expect(
      (
        await axios.get(`${SERVER_URL}/me/friends/requests`, answeringUser.auth)
      ).data.some(checkFriendRequestComesFromUser(requestingUser.data))
    ).toBeFalsy()
    expect(
      (
        await axios.get(`${SERVER_URL}/me/friends`, answeringUser.auth)
      ).data.some(checkFriendMatchesUser(requestingUser.data))
    ).toBeFalsy()
    expect(
      (
        await axios.get(`${SERVER_URL}/me/friends`, requestingUser.auth)
      ).data.some(checkFriendMatchesUser(answeringUser.data))
    ).toBeFalsy()
  })

  it('404 - when no friendship request was found', async () => {
    const { answeringUser, requestingUser } =
      await getRequestingAndAnsweringUserPair()

    await axios
      .put(
        `${SERVER_URL}/me/friends/requests/${requestingUser.data.id}`,
        { accept: false },
        answeringUser.auth
      )
      .then(() => {
        throw new Error('Should have thrown a 404 error')
      })
      .catch((error) => {
        expect(error.response.status).toBe(404)
      })
  })
})

describe('GET /me/friends', () => {
  it("200 - returns the logged user's friends", async () => {
    const { requestingUser, answeringUser } =
      await getRequestingAndAnsweringUserPair()
    await createFriendship({ requestingUser, answeringUser })
    const anonFriend = await createAnonFriend(requestingUser.data.id)

    const friends = (
      await axios.get<GenericFriend[]>(
        `${SERVER_URL}/me/friends`,
        requestingUser.auth
      )
    ).data

    expect(friends.length).toBe(2)
    expect(
      friends.some(checkFriendMatchesUser(answeringUser.data))
    ).toBeTruthy()
    expect(friends.some(checkFriendMatchesAnonFriend(anonFriend))).toBeTruthy()
  })
})

describe('DELETE /me/friends/:userId', () => {
  it('200 - deletes a friendship', async () => {
    const { requestingUser, answeringUser } =
      await getRequestingAndAnsweringUserPair()
    await createFriendship({ requestingUser, answeringUser })

    await axios.delete(
      `${SERVER_URL}/me/friends/${answeringUser.data.id}`,
      requestingUser.auth
    )

    expect(
      (
        await axios.get(`${SERVER_URL}/me/friends`, requestingUser.auth)
      ).data.some(checkFriendMatchesUser(answeringUser.data))
    ).toBeFalsy()
  })

  it('404 - when no friendship was found', async () => {
    const { requestingUser } = await getRequestingAndAnsweringUserPair()

    await axios
      .delete(`${SERVER_URL}/me/friends/123`, requestingUser.auth)
      .then(() => {
        throw new Error('Should have thrown a 404 error')
      })
      .catch((error) => {
        expect(error.response.status).toBe(404)
      })
  })
})
