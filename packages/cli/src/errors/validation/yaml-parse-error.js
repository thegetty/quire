import ValidationError from './validation-error.js'

export default class YamlParseError extends ValidationError {
  constructor(filePath, reason) {
    super('Error parsing YAML file', {
      filePath,
      reason: reason,
      code: 'YAML_PARSE_ERROR',
    })
  }
}
