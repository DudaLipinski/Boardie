import { WinnersSummary } from '@src/types/Dashboard'
import { axios } from '@src/utils/axios'

export const getWinnersSummary = () =>
  axios<{
    winnersByBoardgame: WinnersSummary[]
    matchesCount: number
  }>({
    method: 'get',
    url: `/me/matches/winners/summary`,
  }).then((response) => {
    return response.data
  })
