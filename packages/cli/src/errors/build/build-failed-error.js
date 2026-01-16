import QuireError from '../quire-error.js'

/**
 * Error thrown when the publication build fails
 */
export default class BuildFailedError extends QuireError {
  constructor(details) {
    super(
      `Publication build failed${details ? `: ${details}` : ''}`,
      {
        code: 'BUILD_FAILED',
        exitCode: 3,
        suggestion: "Run 'quire build --debug' for detailed error information",
        docsUrl: `${QuireError.DOCS_BASE}/troubleshooting/`
      }
    )
  }
}
