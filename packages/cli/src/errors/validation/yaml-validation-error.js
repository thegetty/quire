import ValidationError from './validation-error.js'

export default class YamlValidationError extends ValidationError {
  constructor(filePath, reason) {
    super('Error validating YAML file', {
      filePath,
      reason: reason,
      code: 'YAML_VALIDATION_ERROR',
    })
  }
}