/**
 * PDF engine schema definition
 *
 * This module has NO imports to avoid circular dependencies.
 * It serves as the single source of truth for PDF engine options.
 */

/**
 * Supported PDF engines
 * @type {string[]}
 */
export const ENGINES = ['pagedjs', 'prince']

/**
 * Schema definition for pdfEngine config property
 */
export const schema = {
  type: 'string',
  enum: ENGINES,
  description: 'Default PDF engine to use (pagedjs, prince)'
}
