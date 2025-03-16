/**
 * @see https://spec.openapis.org/oas/v3.1.1.html#parameter-object
 */
export interface ParameterDefinition {
  type: 'string' | 'number' | 'boolean'
  description: string
  required: boolean
  deprecated?: boolean
}
