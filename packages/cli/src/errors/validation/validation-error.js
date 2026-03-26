import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Base validation error class (exit code: 4)
 *
 * Used for YAML validation, schema violations, and configuration errors.
 * Maintains backward compatibility with existing properties (filePath, reason, code).
 */
export default class ValidationError extends QuireError {
  constructor(message, { filePath, reason, code, suggestion, docsUrl: docsUrlOverride } = {}) {
    super(message, {
      code,
      exitCode: 4,
      filePath,
      suggestion: suggestion || (reason ? `Fix: ${reason}` : undefined),
      docsUrl: docsUrlOverride || docsUrl('troubleshooting')
    })
    // Maintain backward compatibility
    this.reason = reason
  }
}
