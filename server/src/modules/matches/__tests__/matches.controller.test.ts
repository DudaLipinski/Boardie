import axios from 'axios'
import { getAuthConfig, SERVER_URL } from '../../../utils/testing.utils'
import { friendsControllerMocks } from '../../friends/__tests__/friends.controller.mocks'
import { anonFriendsControllerMocks } from '../../friends/anonFriends/__tests__/anonFriends.controllers.mocks'
import { matchesSchemaMocks } from './matches.schema.mocks'
import { FriendType } from '../../friends/friends.schema'

describe('GET /me/matches/winners/summary', () => {
  it('groups wins from players that are not friends of the user into a shallow counter for each boardgame', async () => {
    const { userA, userB } = await friendsControllerMocks.createFriendUsers()
    const userAAsFriend = {
      id: userA.data.id,
      type: FriendType.USER,
    }
    const userBAsFriend = {
      id: userB.data.id,
      type: FriendType.USER,
    }

    const userA_anonFriend = await anonFriendsControllerMocks.createAnonFriend(
      userA.data.id,
    )
    const userA_anonFriend_asFriend = {
      id: userA_anonFriend.id,
      type: FriendType.ANON_FRIEND,
    }

    const userB_anonFriend = await anonFriendsControllerMocks.createAnonFriend(
      userB.data.id,
    )
    const userB_anonFriend_asFriend = {
      id: userB_anonFriend.id,
      type: FriendType.ANON_FRIEND,
    }

    // Create the match under the user A account, with the userA's anon friend as the winner
    await axios.post(
      `${SERVER_URL}/me/matches`,
      matchesSchemaMocks.creationData([
        {
          friend: userAAsFriend,
          score: 50,
          isWinner: false,
        },
        {
          friend: userBAsFriend,
          score: 30,
          isWinner: false,
        },
        {
          friend: userA_anonFriend_asFriend,
          score: 100,
          isWinner: true,
        },
      ]),
      userA.auth,
    )

    // // Create the match under the user B account, with the userB's anon friend as the winner
    // await axios.post(
    //   `${SERVER_URL}/me/matches`,
    //   matchesSchemaMocks.creationData([
    //     {
    //       friend: userAAsFriend,
    //       score: 20,
    //       isWinner: false,
    //     },
    //     {
    //       friend: userBAsFriend,
    //       score: 40,
    //       isWinner: false,
    //     },
    //     {
    //       friend: userB_anonFriend_asFriend,
    //       score: 80,
    //       isWinner: true,
    //     },
    //   ]),
    //   userB.auth,
    // )

    // const { data: userBWinnersSummary } = await axios.get(
    //   `${SERVER_URL}/me/matches/winners/summary`,
    //   userB.auth,
    // )
    // expect(userBWinnersSummary.matchesCount).toBe(2)
    // expect(userBWinnersSummary.winnersByBoardgame).toHaveLength(1)
    // const boardgameSummary = userBWinnersSummary.winnersByBoardgame[0]
    // expect(boardgameSummary.unknownPlayersWins).toBe(1)
    // expect(boardgameSummary.players).toHaveLength(1)
    // expect(boardgameSummary.players[0]).toEqual({
    //   id: userB_anonFriend.id,
    //   type: FriendType.ANON_FRIEND,
    //   wins: 1,
    // })

    // const { data: userAWinnersSummary } = await axios.get(
    //   `${SERVER_URL}/me/matches/winners/summary`,
    //   userA.auth,
    // )
    // expect(userAWinnersSummary.matchesCount).toBe(2)
    // expect(userAWinnersSummary.winnersByBoardgame).toHaveLength(1)
    // const boardgameSummaryA = userAWinnersSummary.winnersByBoardgame[0]
    // expect(boardgameSummaryA.unknownPlayersWins).toBe(1)
    // expect(boardgameSummaryA.players).toHaveLength(1)
    // expect(boardgameSummaryA.players[0]).toEqual({
    //   id: userA_anonFriend.id,
    //   type: FriendType.ANON_FRIEND,
    //   wins: 1,
    // })
  })
})
