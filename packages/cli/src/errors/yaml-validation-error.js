import ValidationError from './validation-error.js'

export default class YamlValidationError extends ValidationError {
  constructor(filePath, originalError) {
    super('Error parsing YAML file', {
      filePath,
      reason: originalError.message,
      code: 'YAML_PARSE_ERROR',
    })
  }
}