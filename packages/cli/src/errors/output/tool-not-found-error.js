import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Error thrown when a required external tool is not found
 */
export default class ToolNotFoundError extends QuireError {
  constructor(toolName, installUrl) {
    super(
      `Required tool '${toolName}' is not installed`,
      {
        code: 'TOOL_NOT_FOUND',
        exitCode: 5,
        suggestion: `Install ${toolName} from ${installUrl}`,
        docsUrl: docsUrl('pdf-output')
      }
    )
  }
}
