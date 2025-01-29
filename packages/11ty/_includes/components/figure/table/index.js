/**
 * Render all `table` outputs
 */
export default function (eleventyConfig) {
  const renderOutputs = eleventyConfig.getFilter('renderOutputs')
  return function (params) {
    return renderOutputs(import.meta.dirname, params)
  }
}
