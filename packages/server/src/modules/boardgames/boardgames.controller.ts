import z from 'zod'
import { endpoint } from '../../utils/endpoint.utils'
import type { DataObject } from '../../utils/schema.utils'
import { getDataObjectSchema } from '../../utils/schema.utils'
import type { BoardgameDTO } from './boardgames.schema'
import { boardgameDtoSchema } from './boardgames.schema'
import * as boardgameModel from './boardgames.model'

const getAll = endpoint.GET('/boardgames')<
  void,
  void,
  DataObject<BoardgameDTO[]>,
  void
>(
  async (_, res) => {
    const boardgames = await boardgameModel.getFullList()

    res.status(200).send({ data: boardgames })
  },
  {
    summary: 'Gets all the boardgames',
    tags: ['boardgames'],
    responses: {
      200: {
        description: 'All boardgames',
        schema: getDataObjectSchema(z.array(boardgameDtoSchema)),
      },
    },
  }
)

const search = endpoint.GET('/boardgames/search')<
  void,
  void,
  DataObject<BoardgameDTO[]>,
  { query: string }
>(
  async (req, res) => {
    const { query } = req.query

    const boardgames = await boardgameModel.searchByTitle(query)

    res.status(200).send({ data: boardgames })
  },
  {
    summary: 'Searches for boardgames',
    tags: ['boardgames'],
    queryParams: {
      query: {
        description: 'The query to search for',
        type: 'string',
        required: true,
      },
    },
    responses: {
      200: {
        description: 'Matching boardgames',
        schema: getDataObjectSchema(z.array(boardgameDtoSchema)),
      },
    },
  }
)

export const endpoints = {
  getAll,
  search,
}
