export class HandlerError {
  createError ({ name = 'Error', code, cause, message }) {
    const error = new Error()
    error.name = name
    error.code = code
    error.cause = cause
    error.message = message
    throw error
  }
}
