import chalkFactory from '#lib/chalk/index.js'

// eslint-disable-next-line no-unused-vars
const logger = chalkFactory('plugins:linters')
/**
 * Register linters that will be run on input templates
 * @see {@link https://www.11ty.dev/docs/config/#linters}
 *
 * Nota bene: linters are run on the input *before* applying layouts
 */
export default function (eleventyConfig, options) {
  // eleventyConfig.addLinter('test', function(content) {
  //   logger.info(`writing ${this.inputPath} to ${this.outputPath}`)
  // })
}
