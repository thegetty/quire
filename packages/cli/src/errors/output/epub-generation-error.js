import QuireError from '../quire-error.js'

/**
 * Error thrown when EPUB generation fails
 */
export default class EpubGenerationError extends QuireError {
  constructor(details) {
    super(
      `EPUB generation failed: ${details}`,
      {
        code: 'EPUB_FAILED',
        exitCode: 5,
        suggestion: 'Check that your publication built successfully first',
        docsUrl: `${QuireError.DOCS_BASE}/epub-output/`
      }
    )
  }
}
