/**
 * Quire configuration module
 *
 * Exports the singleton Conf instance as the default export
 * and named helper functions for schema-aware operations.
 *
 * @example
 * import config from '#lib/conf/index.js'
 * import { isValidKey, coerceValue } from '#lib/conf/index.js'
 */
export { default as default } from './config.js'
export {
  isValidKey,
  getValidKeys,
  coerceValue,
  formatValidationError,
  getDefault,
} from './helpers.js'
export {
  getKeyDescription,
  formatSettings,
} from './format.js'
