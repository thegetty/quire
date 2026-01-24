/**
 * Installation errors (exit code: 6)
 *
 * Errors related to dependency installation and version management.
 *
 * @module errors/install
 */
export { default as DependencyInstallError } from './dependency-install-error.js'
export { default as DirectoryNotEmptyError } from './directory-not-empty-error.js'
export { default as InvalidPathError } from './invalid-path-error.js'
export { default as InvalidStarterError } from './invalid-starter-error.js'
export { default as VersionNotFoundError } from './version-not-found-error.js'
