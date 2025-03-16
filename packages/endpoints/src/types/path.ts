import type { ParameterDefinition } from './parameter'

/**
 * @see https://spec.openapis.org/oas/v3.1.1.html#path-templating
 */
export type PathParamsFromUrl<Url extends string> =
  Url extends `${string}/:${infer Param}/${infer Rest}`
    ? Param | PathParamsFromUrl<Rest>
    : Url extends `${string}/:${infer Param}`
      ? Param
      : Url extends `:${infer Param}`
        ? Param
        : never

/**
 * @see https://spec.openapis.org/oas/v3.1.1.html#parameter-object
 */
type PathParameter = Omit<ParameterDefinition, 'required'> // Path parameters are always required

export type PathParametersFromUrl<Url extends string> = {
  [Param in PathParamsFromUrl<Url>]: PathParameter
}

export type PathParameters = {
  [Key: string]: PathParameter
}

export type QueryParameters = {
  [Key: string]: ParameterDefinition
}
