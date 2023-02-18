import { ValidateFunction } from 'ajv'

const DEFAULT_ERROR_MESSAGE = 'Invalid format'
export const getErrorMessage = (validationResult: ValidateFunction) => {
  if (!validationResult.errors) {
    return DEFAULT_ERROR_MESSAGE
  }

  return validationResult.errors
    .map(
      ({ instancePath, message }) =>
        `${instancePath ? `[${instancePath}] ` : ''}${message}`
    )
    .join(', ')
}
