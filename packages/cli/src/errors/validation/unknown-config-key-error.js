import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'
import { suggestSimilar, formatSuggestion } from '#helpers/suggest-similar.js'

/**
 * Error thrown when an unrecognized configuration key is used
 *
 * @param {string} key - The unrecognized key
 * @param {string[]} validKeys - Array of valid configuration keys
 */
export default class UnknownConfigKeyError extends QuireError {
  constructor(key, validKeys) {
    const suggestion = formatSuggestion(suggestSimilar(key, validKeys))
      || `Valid keys: ${validKeys.join(', ')}`

    super(
      `Unknown configuration key: ${key}`,
      {
        code: 'UNKNOWN_CONFIG_KEY',
        exitCode: 4,
        suggestion,
        docsUrl: docsUrl('quire-commands/'),
        showDebugHint: false
      }
    )
  }
}
