import type { OpenAPIV3_1 } from 'openapi-types'
import type { ParameterDefinition } from '../types/parameter'
import type { OperationDefinition } from '../types/requestHandler'
import zodToJsonSchema from 'zod-to-json-schema'

const getOpenApiParameter = (
  _in: 'query' | 'path',
  [paramName, paramSchema]: [string, unknown],
): OpenAPIV3_1.ParameterObject => {
  const schema = paramSchema as ParameterDefinition

  return {
    in: _in,
    name: paramName,
    required: schema.required ?? true,
    schema: {
      type: schema.type,
    },
  }
}

const getOpenApiParameters = (
  def: OperationDefinition<any>,
): OpenAPIV3_1.ParameterObject[] => {
  const pathParams = def.pathParams
    ? Object.entries(def.pathParams).map(getOpenApiParameter.bind(null, 'path'))
    : []

  const queryParams = def.queryParams
    ? Object.entries(def.queryParams).map(
        getOpenApiParameter.bind(null, 'query'),
      )
    : []

  const params = [...pathParams, ...queryParams]
  return params
}

const getOpenApiRequestBody = (
  def: OperationDefinition<any>,
): OpenAPIV3_1.RequestBodyObject | undefined => {
  if (!def.body) {
    return undefined
  }

  return {
    content: {
      'application/json': {
        schema: zodToJsonSchema(def.body, { target: 'openApi3' }),
      },
    },
  }
}

const getOpenApiResponses = (def: OperationDefinition<any>) =>
  Object.entries(def.responses).reduce((result, [statusCode, res]) => {
    if (res === undefined) {
      return result
    }

    const response = res
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

export const getOpenApiObject = (
  def: OperationDefinition<any>,
): OpenAPIV3_1.OperationObject => ({
  summary: def.summary,
  tags: def.tags,
  parameters: getOpenApiParameters(def),
  requestBody: getOpenApiRequestBody(def),
  responses: getOpenApiResponses(def),
  security: def.security ?? undefined,
})
