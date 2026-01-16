import QuireError from '../quire-error.js'

/**
 * Error thrown when required build output is missing
 */
export default class MissingBuildOutputError extends QuireError {
  constructor(outputType, expectedPath) {
    super(
      `Cannot generate ${outputType}: build output not found`,
      {
        code: 'BUILD_OUTPUT_MISSING',
        exitCode: 5,
        filePath: expectedPath,
        suggestion: "Run 'quire build' first, then try again",
        docsUrl: `${QuireError.DOCS_BASE}/quire-commands/`
      }
    )
  }
}
