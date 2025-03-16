import type { Express } from 'express'

import { logInternalError } from './utils/log.utils'
import type {
  HttpMethod,
  OperationDefinition,
  RequestHandler,
} from './types/requestHandler'
import { getOpenApiObject } from './utils/openApi.utils'

const endpoint = <Path extends string, T extends OperationDefinition<Path>>(
  method: HttpMethod,
  path: Path,
  handler: RequestHandler<T>,
  def: T,
) => {
  const handle: RequestHandler<T> = async (req, res, next) => {
    if (def.queryParams) {
      const requiredQueryParams = Object.entries(def.queryParams).filter(
        ([, param]) => param.required,
      )

      const missingQueryParams = requiredQueryParams
        .filter(
          ([paramName]) =>
            !Object.prototype.hasOwnProperty.call(req.query, paramName),
        )
        .map(([paramName]) => paramName)

      if (missingQueryParams.length > 0) {
        return res.status(400).send({
          message: `Missing query params: ${missingQueryParams.join(', ')}`,
        })
      }
    }

    if (def.body) {
      const bodyParseResult = def.body.safeParse(req.body)

      if (!bodyParseResult.success) {
        const errorMessage = JSON.stringify(
          bodyParseResult.error.format(),
        ).replace(/"/g, "'")

        return res.status(400).send({ message: errorMessage })
      }
    }

    try {
      await handler(req, res, next)
    } catch (error) {
      logInternalError(error)
      res.status(500).send({ message: 'Internal server error' })
    }
  }

  const setRouter = (app: Express) => {
    app[method](path, handle)
  }

  return {
    path,
    getPath: () => path,
    method,
    getMethod: () => method,
    setRouter,
    getOpenApiObject: () => getOpenApiObject(def),
  }
}

const endpointWithMethod =
  (method: HttpMethod) =>
  <Path extends string, T extends OperationDefinition<Path>>(
    path: Path,
    handler: RequestHandler<T>,
    def: T,
  ) =>
    endpoint(method, path, handler, def)

export const endpointMethods = {
  get: endpointWithMethod('get'),
  post: endpointWithMethod('post'),
  put: endpointWithMethod('put'),
  delete: endpointWithMethod('delete'),
  patch: endpointWithMethod('patch'),
  head: endpointWithMethod('head'),
  options: endpointWithMethod('options'),
}
