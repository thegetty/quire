import QuireError from '../quire-error.js'

/**
 * Error thrown when PDF generation fails
 *
 * @param {string} tool - The PDF tool that failed (e.g., 'Paged.js', 'Prince')
 * @param {string} operation - The operation that failed (e.g., 'PDF rendering', 'page map extraction')
 * @param {string} [details] - Additional error details from the underlying error
 */
export default class PdfGenerationError extends QuireError {
  constructor(tool, operation, details) {
    const message = details
      ? `${tool} ${operation} failed: ${details}`
      : `${tool} ${operation} failed`

    super(message, {
      code: 'PDF_FAILED',
      exitCode: 5,
      suggestion: `Check that ${tool} is properly configured and the input files are valid`,
      docsUrl: `${QuireError.DOCS_BASE}/pdf-output/`
    })
  }
}
