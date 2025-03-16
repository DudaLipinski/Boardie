import type { OpenAPIV3_1 } from 'openapi-types'
import type { RequestHandler as ExpressRequestHandler } from 'express'
import { z } from 'zod'
import type { PathParametersFromUrl, QueryParameters } from './path'
import type { Responses, Response } from './responses'

interface MessageBody {
  message: string
}

export type HttpMethod = `${OpenAPIV3_1.HttpMethods}`

type ExcludeVoidKeys<T> = {
  [K in keyof T]: T[K] extends void ? never : K
}[keyof T]
type ExcludeVoidProperties<T> = Pick<T, ExcludeVoidKeys<T>>

export type OperationDefinition<Path extends string> = ExcludeVoidProperties<{
  tags: string[]
  summary: string
  pathParams: keyof PathParametersFromUrl<Path> extends never
    ? void
    : PathParametersFromUrl<Path>
  queryParams?: QueryParameters
  body?: z.ZodType<unknown>
  responses: Responses
  security?: OpenAPIV3_1.SecurityRequirementObject[]
}>

interface TypeStringToType {
  string: string
  number: number
  boolean: boolean
}
type ExtractPathParams<T extends OperationDefinition<any>> =
  T['pathParams'] extends never
    ? never
    : {
        [Key in keyof T['pathParams']]: string
        // TODO: re-enable different types after implementing string-to-type conversion inside endpoint
        // [Key in keyof T['pathParams']]: TypeStringToType[T['pathParams'][Key]['type']]
      }

type ExtractQueryParams<T extends OperationDefinition<any>> =
  T['queryParams'] extends QueryParameters
    ? {
        [Key in keyof T['queryParams']]: string
        // TODO: re-enable different types after implementing string-to-type conversion inside endpoint
        // [Key in keyof T['queryParams']]: TypeStringToType[T['queryParams'][Key]['type']]
      }
    : never

type ExtractStatusCodes<T extends OperationDefinition<any>> =
  keyof T['responses']

type ExtractResponses<
  T extends OperationDefinition<any>,
  Code extends keyof T['responses'],
> = T['responses'][Code] extends Response<z.ZodType<infer U>> ? U : never

type ExtractBody<T extends OperationDefinition<any>> = T['body'] extends never
  ? never
  : T['body'] extends z.ZodType<infer U>
    ? U
    : never

export type RequestHandler<T extends OperationDefinition<any>> =
  ExpressRequestHandler<
    ExtractPathParams<T>,
    ExtractResponses<T, ExtractStatusCodes<T>> | MessageBody,
    ExtractBody<T>,
    ExtractQueryParams<T>
  >
