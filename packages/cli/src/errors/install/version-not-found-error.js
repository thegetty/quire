import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Error thrown when a requested package version is not found
 */
export default class VersionNotFoundError extends QuireError {
  constructor(packageName, requestedVersion) {
    super(
      `Version '${requestedVersion}' of ${packageName} not found`,
      {
        code: 'VERSION_NOT_FOUND',
        exitCode: 6,
        suggestion: `Run 'npm view ${packageName} versions' to see available versions`,
        docsUrl: docsUrl('install-uninstall')
      }
    )
  }
}
