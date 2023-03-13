export const handleAxiosError = (error: {
  isAxiosError?: any
  response?: any
}) => {
  if (error.isAxiosError) {
    const { response } = error

    if (response) {
      console.error(response)
      throw new Error('An error occurred')
    } else {
      console.error(error)
      throw new Error('Network error')
    }
  }

  console.error(error)
  throw new Error('Unexpected error')
}
