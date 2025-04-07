import { fileURLToPath } from 'node:url'

export default function (eleventyConfig) {
  const renderOutputs = eleventyConfig.getFilter('renderOutputs')
  return function (params) {
    return renderOutputs(fileURLToPath(import.meta.url), params)
  }
}
