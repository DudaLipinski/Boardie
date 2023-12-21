import { axios } from '../utils/axios'

export const searchBoardgames = (query: string) =>
  axios
    .get<{ data: Boardgame[] }>(`/boardgames/search?query=${query}`)
    .then((response) => {
      return response.data.data
    })
