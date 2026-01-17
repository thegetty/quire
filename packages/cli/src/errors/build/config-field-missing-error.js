import QuireError from '../quire-error.js'

/**
 * Error thrown when a required field is missing from a configuration file
 */
export default class ConfigFieldMissingError extends QuireError {
  constructor(fieldName, configFile) {
    super(
      `Missing required field '${fieldName}' in ${configFile}`,
      {
        code: 'CONFIG_FIELD_MISSING',
        exitCode: 3,
        filePath: `content/_data/${configFile}`,
        suggestion: `Add '${fieldName}' to your ${configFile}`,
        docsUrl: `${QuireError.DOCS_BASE}/publication-configuration/`
      }
    )
  }
}
