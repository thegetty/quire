import ValidationError from './validation-error.js'

export class YamlValidationError extends ValidationError {
  constructor(filePath, reason) {
    super('Error validating YAML file', {
      filePath,
      reason: reason,
      code: 'YAML_VALIDATION_ERROR',
    })
  }
}

export class YamlParseError extends ValidationError {
  constructor(filePath, reason) {
    super('Error parsing YAML file', {
      filePath,
      reason: reason,
      code: 'YAML_PARSE_ERROR',
    })
  }
}

export class YamlDuplicateIdError extends ValidationError {
  constructor(filePath, reason) {
    super('Duplicate ID found in YAML file', {
      filePath,
      reason: reason,
      code: 'YAML_DUPLICATE_ID_ERROR',
    })
  }
}