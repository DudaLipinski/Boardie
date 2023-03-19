export const catchInternalError = (err: any) => {
  if (err.status === 500) {
    throw new Error('Unexpected internal error')
  }
}

export const getErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'An error ocurred'

  return message
}
