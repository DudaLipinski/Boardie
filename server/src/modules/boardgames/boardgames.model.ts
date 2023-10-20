import fuzzysort from 'fuzzysort'
import kysely from '../../database'
import { Cached } from '../../utils/cache.utils'

const cachedBoardgames = new Cached(async () => {
  const boardgames = await kysely.selectFrom('boardgame').selectAll().execute()

  const boardgamesById = boardgames.reduce((acc, boardgame) => {
    acc[boardgame.id] = boardgame
    return acc
  }, {} as Record<number, (typeof boardgames)[0]>)

  return {
    list: boardgames,
    byId: boardgamesById,
  }
})

export const getFullList = async () => (await cachedBoardgames.get()).list
export const getAllMappedById = async () => (await cachedBoardgames.get()).byId

export const searchByTitle = async (title: string) => {
  const boardgames = await cachedBoardgames.get()

  const result = fuzzysort.go(title, boardgames.list, {
    key: 'title',
    limit: 50,
    threshold: -10000,
  })
  return result.map((r) => r.obj)
}

export const getById = async (id: number) => {
  const boardgames = await cachedBoardgames.get()
  return boardgames.byId[id] ?? null
}
