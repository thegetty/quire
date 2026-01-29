import InvalidInputError from '../input/invalid-input-error.js'
import QuireError from '../quire-error.js'

/**
 * Error thrown when a requested help topic does not exist
 */
export default class HelpTopicNotFoundError extends InvalidInputError {
  constructor(topic) {
    super(
      `Unknown help topic: ${topic}`,
      {
        code: 'HELP_TOPIC_NOT_FOUND',
        exitCode: 2,
        inputValue: topic,
        inputName: 'topic',
        suggestion: 'Run "quire help --list" to see available topics',
        docsUrl: `${QuireError.DOCS_BASE}/quire-commands/`
      }
    )
    this.topic = topic
  }
}
