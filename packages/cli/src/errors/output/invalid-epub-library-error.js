import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

/**
 * Error thrown when an unrecognized EPUB library is specified
 */
export default class InvalidEpubLibraryError extends QuireError {
  constructor(libName, validLibraries = ['epubjs', 'pandoc']) {
    super(
      `Unrecognized EPUB library '${libName}'`,
      {
        code: 'INVALID_EPUB_LIBRARY',
        exitCode: 5,
        suggestion: `Use one of: ${validLibraries.join(', ')}`,
        docsUrl: docsUrl('epub-output')
      }
    )
  }
}
