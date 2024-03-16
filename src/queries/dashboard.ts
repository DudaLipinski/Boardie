import { useQuery } from 'react-query'

import * as dashboardService from '../services/dashboard'

const WINNERS_SUMMARY_KEY = 'winnersSummary'
export const useWinnersSummary = () =>
  useQuery(WINNERS_SUMMARY_KEY, dashboardService.getWinnersSummary, {
    staleTime: Infinity,
  })
