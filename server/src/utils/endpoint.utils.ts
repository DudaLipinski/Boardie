import type { RequestHandler, Express } from 'express'
import type { OpenAPIV3_1 } from 'openapi-types'
import type { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import {
  INTERNAL_ERROR_SCHEMA,
  INVALID_REQUEST_BODY_SCHEMA,
} from './errors.schema'
import { logInternalError } from './log.utils'

type HttpMethod = 'get' | 'post' | 'put' | 'delete'
type ContentType =
  | 'application/json'
  | 'text/plain'
  | 'text/html'
  | 'multipart/form-data'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream'

type ParameterObject = Pick<OpenAPIV3_1.ParameterObject, 'description'> &
  Partial<Pick<OpenAPIV3_1.ParameterObject, 'required'>> & {
    // TODO: we can make this type strict if we add a generic type to ParameterObject
    type: 'string' | 'number'
  }
type Params = Record<string, string | number> | void

interface Response<ContentSchema> {
  description?: string
  contentType?: ContentType
  schema?: z.ZodType<ContentSchema>
}
interface MessageBody {
  message: string
}
interface MessageResponse {
  [code: number]: Response<MessageBody> | undefined
}
interface SuccessResponse<ResponseBody> {
  200: Response<ResponseBody>
}
interface CreationResponse<ResponseBody> {
  201: Response<ResponseBody>
}
type PathResponses<ResponseBody> =
  | SuccessResponse<ResponseBody>
  | CreationResponse<ResponseBody>
  | MessageResponse

type OperationDefinition<
  PathParamsDict extends Params,
  RequestBody,
  ResponseBody,
  QueryParamsDict extends Params
> = {
  path: string
  method: HttpMethod
  tags: string[]
  summary: string
  pathParams: PathParamsDict extends void
    ? null
    : Record<keyof PathParamsDict, ParameterObject>
  queryParams: QueryParamsDict extends void
    ? null
    : Record<keyof QueryParamsDict, ParameterObject>
  body: RequestBody extends void ? null : z.ZodType<RequestBody>
  responses: PathResponses<ResponseBody>
  security?: OpenAPIV3_1.SecurityRequirementObject[]
}

type PathMethodConstructor = (
  path: string
) => <
  PathParamsDict extends Params,
  RequestBody,
  ResponseBody,
  QueryParamsDict extends Params
>(
  handler: RequestHandler<
    PathParamsDict,
    ResponseBody | MessageBody,
    RequestBody,
    QueryParamsDict
  >,
  def: Omit<
    OperationDefinition<
      PathParamsDict,
      RequestBody,
      ResponseBody,
      QueryParamsDict
    >,
    'method' | 'path'
  >
) => Path<PathParamsDict, RequestBody, ResponseBody, QueryParamsDict>

/**
 * A Path represents a single endpoint of the API.
 * It contains all the information needed to generate the OpenAPI spec.
 * It also contains the logic to validate the request and response.
 */
export class Path<
  PathParamsDict extends Params,
  RequestBody,
  ResponseBody,
  QueryParamsDict extends Params
> {
  private path: string
  private method: HttpMethod
  private summary: string
  private tags: string[]
  private pathParams: Record<keyof PathParamsDict, ParameterObject> | null
  private queryParams: Record<keyof QueryParamsDict, ParameterObject> | null
  private body: z.ZodType<RequestBody> | null
  private responses: PathResponses<ResponseBody>
  private allowedStatusCodes: Set<number>
  private security?: OpenAPIV3_1.SecurityRequirementObject[]
  private handler: RequestHandler<
    PathParamsDict,
    ResponseBody | MessageBody,
    RequestBody,
    QueryParamsDict
  >

  constructor(
    handler: RequestHandler<
      PathParamsDict,
      ResponseBody | MessageBody,
      RequestBody,
      QueryParamsDict
    >,
    def: OperationDefinition<
      PathParamsDict,
      RequestBody,
      ResponseBody,
      QueryParamsDict
    >
  ) {
    this.path = def.path
    this.method = def.method
    this.summary = def.summary
    this.tags = def.tags
    this.pathParams = def.pathParams
    this.queryParams = def.queryParams
    this.body = def.body
    this.responses = {
      ...def.responses,
      500: INTERNAL_ERROR_SCHEMA,
      400: this.body ? INVALID_REQUEST_BODY_SCHEMA : undefined,
    }
    this.allowedStatusCodes = new Set(Object.keys(this.responses).map(Number))
    this.security = def.security
    this.handler = handler

    this.validateSchema()
  }

  static GET: PathMethodConstructor = (path) => (handler, def) =>
    new Path(handler, { ...def, path, method: 'get' })
  static POST: PathMethodConstructor = (path) => (handler, def) =>
    new Path(handler, { ...def, path, method: 'post' })
  static PUT: PathMethodConstructor = (path) => (handler, def) =>
    new Path(handler, { ...def, path, method: 'put' })
  static DELETE: PathMethodConstructor = (path) => (handler, def) =>
    new Path(handler, { ...def, path, method: 'delete' })

  getMethod = () => this.method
  getPath = () => this.path

  /**
   * Wraps the provided handler with the following logic:
   * - Validates the request body against the provided schema
   * - Checks that the response status code is one of the allowed ones
   */
  handle: RequestHandler<
    PathParamsDict,
    ResponseBody | MessageBody,
    RequestBody,
    QueryParamsDict
  > = async (req, res, next) => {
    const statusCheckedRes = {
      ...res,
      status: (statusCode: number) => {
        this.checkAllowedStatusCodes(statusCode)
        return res.status(statusCode)
      },
      sendStatus: (statusCode: number) => {
        this.checkAllowedStatusCodes(statusCode)
        return res.sendStatus(statusCode)
      },
    }

    // Checking query params
    if (this.queryParams) {
      const requiredQueryParams = Object.entries(this.queryParams).filter(
        ([, param]) => (param as ParameterObject).required
      )

      const missingQueryParams = requiredQueryParams
        .filter(
          ([paramName]) =>
            !Object.prototype.hasOwnProperty.call(req.query, paramName)
        )
        .map(([paramName]) => paramName)

      if (missingQueryParams.length > 0) {
        return statusCheckedRes.status(400).send({
          message: `Missing query params: ${missingQueryParams.join(', ')}`,
        })
      }
    }

    if (this.body) {
      const bodyParseResult = this.body.safeParse(req.body)

      if (!bodyParseResult.success) {
        const errorMessage = JSON.stringify(
          bodyParseResult.error.format()
        ).replace(/"/g, "'")

        return statusCheckedRes.status(400).send({ message: errorMessage })
      }
    }

    try {
      await this.handler(req, statusCheckedRes as typeof res, next)
    } catch (error) {
      logInternalError(error)
      statusCheckedRes.status(500).send({ message: 'Internal server error' })
    }
  }

  setRouter = (app: Express) => {
    app[this.method](this.path, this.handle)
  }

  getOpenApiObject = (): OpenAPIV3_1.OperationObject => ({
    summary: this.summary,
    tags: this.tags,
    parameters: this.getOpenApiParameters(),
    requestBody: this.getOpenApiRequestBody(),
    responses: this.getOpenApiResponses(),
    security: this.security ?? undefined,
  })

  private getOpenApiParameter = (
    _in: 'query' | 'path',
    [paramName, paramSchema]: [string, unknown]
  ): OpenAPIV3_1.ParameterObject => {
    const schema = paramSchema as ParameterObject

    return {
      in: _in,
      name: paramName,
      required: schema.required ?? true,
      schema: {
        type: schema.type,
      },
    }
  }

  private getOpenApiParameters = () => {
    const getPathParam = this.getOpenApiParameter.bind(this, 'path')
    const pathParams = this.pathParams
      ? Object.entries(this.pathParams).map(getPathParam)
      : []

    const getQueryParam = this.getOpenApiParameter.bind(this, 'query')
    const queryParams = this.queryParams
      ? Object.entries(this.queryParams).map(getQueryParam)
      : []

    const params = [...pathParams, ...queryParams]
    return params.length ? params : undefined
  }

  private getOpenApiRequestBody = () => {
    if (!this.body) {
      return undefined
    }

    return {
      content: {
        'application/json': {
          schema: zodToJsonSchema(this.body, { target: 'openApi3' }),
        },
      },
    }
  }

  private getOpenApiResponses = () =>
    Object.entries(this.responses).reduce((result, [statusCode, res]) => {
      if (res === undefined) {
        return result
      }

      const response = res as Response<unknown>
      const content = response.schema
        ? {
            [response.contentType ?? 'application/json']: {
              schema: zodToJsonSchema(response.schema, {
                target: 'openApi3',
              }),
            },
          }
        : undefined

      return {
        ...result,
        [statusCode]: {
          description: response.description,
          content,
        },
      }
    }, {})

  /**
   * Validates the path params inside the path string (E.g: /users/:id)
   * against the provided params schema, and vice-versa.
   */
  private validatePathParams = () => {
    const requiredParams: string[] = this.pathParams
      ? Object.keys(this.pathParams)
      : []
    if (!requiredParams?.length) return

    const pathParams = (this.path.match(/:[a-zA-Z]+/g) ?? []) as string[]

    const missingOnPath = requiredParams.filter(
      (param) => !pathParams.includes(`:${param}`)
    )
    if (missingOnPath.length > 0) {
      throw new Error(
        `Missing path params ${missingOnPath.join(
          ', '
        )} for path ${this.method.toUpperCase()} ${this.path}`
      )
    }

    const missingOnSchema = pathParams.filter(
      (param) => !requiredParams.includes(param.slice(1))
    )
    if (missingOnSchema.length > 0) {
      throw new Error(
        `Missing schema params ${missingOnSchema.join(
          ', '
        )} for path ${this.method.toUpperCase()} ${this.path}`
      )
    }
  }

  private validateSchema = () => {
    this.validatePathParams()
  }

  // TODO: investigate doing this type-checking with typescript only
  private checkAllowedStatusCodes = (statusCode: number) => {
    if (!this.allowedStatusCodes.has(statusCode)) {
      console.warn(
        `Sending not-defined status code "${statusCode}" for path ${this.method} ${this.path}`
      )
    }
  }
}

export const endpoint = {
  GET: Path.GET,
  POST: Path.POST,
  PUT: Path.PUT,
  DELETE: Path.DELETE,
}
