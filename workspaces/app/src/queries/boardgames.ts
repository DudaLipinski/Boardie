import { useQuery } from 'react-query'

import * as boardgamesService from '../services/boardgames'

const BOARDGAMES_KEY = 'boardgames'
export const useSearchBoardgames = (query: string) =>
  useQuery<Boardgame[]>(
    [BOARDGAMES_KEY, query],
    () => boardgamesService.searchBoardgames(query),
    { enabled: !!query }
  )
