/**
 * A helper module to normalize paths from root directory
 * @module normalize
 */

import path from 'path'
import { projectRoot  } from '#lib/11ty/index.js'

/**
 * Test is if a given image path is normalized to the content/_assets/images directory
 * 
 * @param {String} src 
 * @returns {String}
 */
export function normalizeImagePath(src) {
  return path.join(projectRoot, 'content', '_assets', 'images', src)
}