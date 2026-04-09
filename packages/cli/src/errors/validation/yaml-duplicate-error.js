import ValidationError from './validation-error.js'

export default class YamlDuplicateIdError extends ValidationError {
  constructor(filePath, reason) {
    super('Duplicate ID found in YAML file', {
      filePath,
      reason: reason,
      code: 'YAML_DUPLICATE_ID_ERROR',
    })
  }
}