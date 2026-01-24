/**
 * Centralized error exports for Quire CLI
 *
 * All custom error classes are exported from here for easy imports.
 *
 * @example
 * import { NotInProjectError, BuildFailedError } from '#src/errors/index.js'
 *
 * @module errors
 */

// Base error class
export { default as QuireError } from './quire-error.js'

// Project errors (exit code: 2)
export {
  NotInProjectError,
  ProjectCreateError
} from './project/index.js'

// Build errors (exit code: 3)
export {
  BuildFailedError,
  ConfigFieldMissingError,
  ConfigFileNotFoundError
} from './build/index.js'

// Output errors (exit code: 5)
export {
  EpubGenerationError,
  InvalidEpubLibraryError,
  InvalidPdfLibraryError,
  MissingBuildOutputError,
  PdfGenerationError,
  ToolNotFoundError
} from './output/index.js'

// Install errors (exit code: 6)
export {
  DependencyInstallError,
  DirectoryNotEmptyError,
  InvalidPathError,
  InvalidStarterError,
  VersionNotFoundError
} from './install/index.js'

// Validation errors (exit code: 4)
export { default as ValidationError } from './validation/validation-error.js'
