import z from 'zod'
import { endpoint } from '@boardie/endpoints'
import { getDataObjectSchema } from '../../utils/schema.utils'
import { boardgameDtoSchema } from './boardgames.schema'
import * as boardgameModel from './boardgames.model'

const getAll = endpoint.get(
  '/boardgames',
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
  },
)

const search = endpoint.get(
  '/boardgames/search',
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
  },
)

export const endpoints = {
  getAll,
  search,
}
