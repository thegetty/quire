/**
 * EPUB engine schema definition
 *
 * This module has NO imports to avoid circular dependencies.
 * It serves as the single source of truth for EPUB engine options.
 */

/**
 * Supported EPUB engines
 * @type {string[]}
 */
export const ENGINES = ['epubjs', 'pandoc']

/**
 * Schema definition for epubEngine config property
 */
export const schema = {
  type: 'string',
  enum: ENGINES,
  description: 'Default EPUB engine to use (epubjs, pandoc)'
}
