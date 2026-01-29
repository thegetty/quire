import InvalidInputError from '../input/invalid-input-error.js'
import { docsUrl } from '#helpers/docs-url.js'
import { suggestSimilar, formatSuggestion } from '#helpers/suggest-similar.js'

/**
 * Error thrown when a requested help topic does not exist
 *
 * @param {string} topic - The unrecognized topic name
 * @param {string[]} validTopics - Array of available topic names
 */
export default class HelpTopicNotFoundError extends InvalidInputError {
  constructor(topic, validTopics = []) {
    const suggestion = formatSuggestion(suggestSimilar(topic, validTopics))
      || 'Run "quire help --list" to see available topics'

    super(
      `Unknown help topic: ${topic}`,
      {
        code: 'HELP_TOPIC_NOT_FOUND',
        exitCode: 2,
        inputValue: topic,
        inputName: 'topic',
        suggestion,
        docsUrl: docsUrl('quire-commands/'),
        showDebugHint: false
      }
    )
    this.topic = topic
  }
}
