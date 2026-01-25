import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Error thrown when PDF generation fails
 */
export default class PdfGenerationError extends QuireError {
  constructor(details, tool = 'Prince') {
    super(
      `PDF generation failed: ${details}`,
      {
        code: 'PDF_FAILED',
        exitCode: 5,
        suggestion: `Ensure ${tool} is installed and accessible`,
        docsUrl: docsUrl('pdf-output')
      }
    )
  }
}
