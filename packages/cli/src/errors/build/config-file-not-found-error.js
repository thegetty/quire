import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Error thrown when a required configuration file is not found
 */
export default class ConfigFileNotFoundError extends QuireError {
  constructor(configFile) {
    super(
      `Required configuration file '${configFile}' not found`,
      {
        code: 'CONFIG_FILE_NOT_FOUND',
        exitCode: 3,
        filePath: `content/_data/${configFile}`,
        suggestion: `Create ${configFile} in your content/_data/ folder`,
        docsUrl: docsUrl('publication-configuration')
      }
    )
  }
}
