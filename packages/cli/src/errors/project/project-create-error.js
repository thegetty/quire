import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Error thrown when project creation fails
 */
export default class ProjectCreateError extends QuireError {
  constructor(projectPath, cause) {
    super(
      `Failed to create project at '${projectPath}'`,
      {
        code: 'PROJECT_CREATE_FAILED',
        exitCode: 2,
        filePath: projectPath,
        suggestion: 'Check that the directory is empty and you have write permissions',
        docsUrl: docsUrl('getting-started')
      }
    )
    this.cause = cause
  }
}
