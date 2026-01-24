import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Error thrown when an unrecognized PDF library is specified
 */
export default class InvalidPdfLibraryError extends QuireError {
  constructor(libName, validLibraries = ['prince', 'pagedjs']) {
    super(
      `Unrecognized PDF library '${libName}'`,
      {
        code: 'INVALID_PDF_LIBRARY',
        exitCode: 5,
        suggestion: `Use one of: ${validLibraries.join(', ')}`,
        docsUrl: docsUrl('pdf-output')
      }
    )
  }
}
