import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'
import { suggestSimilar, formatSuggestion } from '#helpers/suggest-similar.js'

/**
 * Error thrown when an unrecognized settings operation is used
 */
export default class UnknownConfigOperationError extends QuireError {
  constructor(operation, validOperations) {
    const suggestion = formatSuggestion(suggestSimilar(operation, validOperations))
      || `Valid operations: ${validOperations.join(', ')}`

    super(
      `Unknown operation: ${operation}`,
      {
        code: 'UNKNOWN_CONFIG_OPERATION',
        exitCode: 4,
        suggestion,
        docsUrl: docsUrl('quire-commands/'),
        showDebugHint: false
      }
    )
  }
}
