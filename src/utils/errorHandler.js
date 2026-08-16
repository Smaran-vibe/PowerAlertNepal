export function getErrorMessage(error) {

  if (!error?.response) {
    return 'Unable to reach the server. Please check your connection and try again.'
  }

  const data = error.response.data

  if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.map(fieldError => fieldError.message).join(' ')
  }

  if (data?.message) {
    return data.message
  }

  return 'Something went wrong. Please try again.'
}