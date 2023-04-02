import type { RequestHandler, Express } from 'express'
import type { OpenAPIV3_1 } from 'openapi-types'
import type { z } from 'zod'
import { logInternalError } from './log'
import {
  ZOD_INTERNAL_ERROR_SCHEMA,
  ZOD_INVALID_REQUEST_BODY_SCHEMA,
} from './errors'

type HttpMethod = 'get' | 'post' | 'put' | 'delete'
type ContentType =
  | 'application/json'
  | 'text/plain'
  | 'text/html'
  | 'multipart/form-data'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream'

type ParameterObject = Pick<OpenAPIV3_1.ParameterObject, 'description'> &
  Partial<Pick<OpenAPIV3_1.ParameterObject, 'in' | 'required'>> & {
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

interface OperationDefinition<
  ParamsDict extends Params,
  RequestBody,
  ResponseBody
> {
  path: string
  method: HttpMethod
  tags: string[]
  summary: string
  // TODO: find a way to make this required if ParamsDict is not void
  params: ParamsDict extends void
    ? null
    : Record<keyof ParamsDict, ParameterObject>
  // TODO: find a way to make this required if RequestBody is not void
  body: RequestBody extends void ? null : z.ZodType<RequestBody>
  responses: PathResponses<ResponseBody>
}

type PathMethodConstructor = (
  path: string
) => <ParamsDict extends Params, RequestBody, ResponseBody>(
  handler: RequestHandler<ParamsDict, ResponseBody | MessageBody, RequestBody>,
  def: Omit<
    OperationDefinition<ParamsDict, RequestBody, ResponseBody>,
    'method' | 'path'
  >
) => Path<ParamsDict, RequestBody, ResponseBody>

/**
 * A Path represents a single endpoint of the API.
 * It contains all the information needed to generate the OpenAPI spec.
 * It also contains the logic to validate the request and response.
 */
export class Path<ParamsDict extends Params, RequestBody, ResponseBody> {
  private path: string
  private method: HttpMethod
  private summary: string
  private tags: string[]
  private params: Record<keyof ParamsDict, ParameterObject> | null
  private body: z.ZodType<RequestBody> | null
  private responses: PathResponses<ResponseBody>
  private allowedStatusCodes: Set<number>
  private handler: RequestHandler<
    ParamsDict,
    ResponseBody | MessageBody,
    RequestBody
  >

  constructor(
    handler: RequestHandler<
      ParamsDict,
      ResponseBody | MessageBody,
      RequestBody
    >,
    def: OperationDefinition<ParamsDict, RequestBody, ResponseBody>
  ) {
    this.path = def.path
    this.method = def.method
    this.summary = def.summary
    this.tags = def.tags
    this.params = def.params
    this.body = def.body
    this.responses = {
      ...def.responses,
      500: ZOD_INTERNAL_ERROR_SCHEMA,
      400: this.body ? ZOD_INVALID_REQUEST_BODY_SCHEMA : undefined,
    }
    this.allowedStatusCodes = new Set(Object.keys(this.responses).map(Number))
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
  handle: RequestHandler<ParamsDict, ResponseBody | MessageBody, RequestBody> =
    async (req, res, next) => {
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

  // TODO: split this method into smaller ones
  getOpenApiObject = (): OpenAPIV3_1.PathItemObject => ({
    [this.method]: {
      summary: this.summary,
      tags: this.tags,
      parameters: this.params
        ? Object.entries(this.params).map(
            ([paramName, paramSchema]): OpenAPIV3_1.ParameterObject => {
              const schema = paramSchema as ParameterObject
              return {
                in: schema.in ?? 'path',
                name: paramName,
                required: schema.required ?? true,
                schema: {
                  type: schema.type,
                },
              }
            }
          )
        : undefined,
      requestBody: this.body
        ? {
            content: {
              'application/json': {
                schema: this.body,
              },
            },
          }
        : undefined,
      responses: Object.entries(this.responses).reduce(
        (result, [statusCode, res]) => {
          if (res === undefined) {
            return result
          }

          const response = res as Response<unknown>
          const content = response.schema
            ? {
                [response.contentType ?? 'application/json']: {
                  schema: response.schema,
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
        },
        {}
      ),
    },
  })

  setRouter = (app: Express) => {
    app[this.method](this.path, this.handle)
  }

  /**
   * Validates the path params inside the path string (E.g: /users/:id)
   * against the provided params schema, and vice-versa.
   */
  private validatePathParams = () => {
    const requiredParams: string[] = this.params ? Object.keys(this.params) : []
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
