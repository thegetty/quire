/**
 * Project-related errors (exit code: 2)
 *
 * Errors related to project setup and detection.
 * Used when commands are run outside a Quire project or project creation fails.
 *
 * @module errors/project
 */
export { default as NotInProjectError } from './not-in-project-error.js'
export { default as ProjectCreateError } from './project-create-error.js'
