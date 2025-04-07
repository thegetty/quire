import { fileURLToPath } from 'node:url'

/**
 * Render all `table` outputs
 */
export default function (eleventyConfig) {
  const renderOutputs = eleventyConfig.getFilter('renderOutputs')
  return function (params) {
    return renderOutputs(fileURLToPath(import.meta.url), params)
  }
}
