export default class ValidationError extends Error {
  constructor(message, {filePath, reason, code} = {}) {
    super(message)
    this.name = this.constructor.name
    this.filePath = filePath
    this.reason = reason
    this.code = code

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}