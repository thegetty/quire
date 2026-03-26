import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Error thrown when dependency installation fails
 */
export default class DependencyInstallError extends QuireError {
  constructor(details) {
    super(
      `Failed to install dependencies: ${details}`,
      {
        code: 'DEPENDENCY_INSTALL_FAILED',
        exitCode: 6,
        suggestion: "Try running 'npm install' manually to see detailed errors",
        docsUrl: docsUrl('troubleshooting')
      }
    )
  }
}
