import { useQuery } from 'react-query'

import * as boardgamesService from '../services/boardgames'
import type { Boardgame } from '@src/types/Boardgame'

const BOARDGAMES_KEY = 'boardgames'
export const useSearchBoardgames = (query: string) =>
  useQuery<Boardgame[]>(
    [BOARDGAMES_KEY, query],
    () => boardgamesService.searchBoardgames(query),
    { enabled: !!query }
  )
