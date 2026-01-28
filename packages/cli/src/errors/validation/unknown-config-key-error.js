import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'
import { suggestSimilar, formatSuggestion } from '#helpers/suggest-similar.js'
import { getValidKeys } from '#lib/conf/index.js'

/**
 * Error thrown when an unrecognized configuration key is used
 */
export default class UnknownConfigKeyError extends QuireError {
  constructor(key) {
    const validKeys = getValidKeys()
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
