const camelize = require('camelize')
const exifr = require('exifr')

/**
 * Custom data formats
 * Nota bene: the order in which extensions are added sets their precedence
 * in the data cascade, the last added will take precedence over the first.
 * @see https://www.11ty.dev/docs/data-cascade/
 * @see https://www.11ty.dev/docs/data-custom/#ordering-in-the-data-cascade
 */
module.exports = function(eleventyConfig, options) {
  eleventyConfig.addDataExtension('jpeg,jpg,png', {
    // @see https://github.com/MikeKovarik/exifr#usage
    parser: async (file) => await exifr.parse(file),
    read: false
  })

  eleventyConfig.addDataExtension('json5', (contents) => json5.parse(contents))

  eleventyConfig.addDataExtension('toml', (contents) => toml.load(contents))

  eleventyConfig.addDataExtension('yaml,yml', (contents) => {
    const data = yaml.load(contents, {
      // filename: ,
      // json: true,
      // onWarning: (exception) => console.warn(exception),
      // schema: 'DEFAULT_SCHEMA'
    })
    console.error(data)
    return data // yaml.load(contents, options)
  })

  eleventyConfig.addDataExtension('geojson', (contents) => JSON.parse(contents))
}
