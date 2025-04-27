import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Render all `table` outputs
 */
export default function (eleventyConfig) {
  const renderOutputs = eleventyConfig.getFilter('renderOutputs')
  return function (params) {
    return renderOutputs(path.dirname(fileURLToPath(import.meta.url)), params)
  }
}
