import axios from 'axios'
import { Match } from '../types/Match'
const SERVER_URL = process.env.REACT_APP_SERVER_URL

export const createMatch = (matchPayload: Omit<Match, 'id' | 'authorId'>) =>
  axios({
    method: 'post',
    url: `${SERVER_URL}/me/matches`,
    data: matchPayload,
  }).then((response) => {
    return response.data
  })

export const getMatches = (): Promise<Match[]> =>
  axios({
    method: 'get',
    url: `${SERVER_URL}/me/matches`,
  }).then((response) => {
    return response.data
  })

export const getMatch = (matchId: string): Promise<Match> =>
  axios({
    method: 'get',
    url: `${SERVER_URL}/match/${matchId}`,
  }).then((response) => {
    return response.data
  })
