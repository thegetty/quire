import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Error thrown when a command is run outside a Quire project directory
 */
export default class NotInProjectError extends QuireError {
  constructor(commandName) {
    super(
      `The '${commandName}' command must be run inside a Quire project`,
      {
        code: 'NOT_IN_PROJECT',
        exitCode: 2,
        suggestion: "Navigate to your project folder with 'cd your-project-name'",
        docsUrl: docsUrl('quire-commands'),
        showDebugHint: false
      }
    )
  }
}
