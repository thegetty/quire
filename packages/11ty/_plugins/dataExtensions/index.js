// const camelize = require('camelize')
const exifr = require('exifr')
const json5 = require('json5')
const toml = require('toml')
const yaml = require('js-yaml')

/**
 * Custom data formats
 * @see https://www.11ty.dev/docs/data-custom/#custom-data-file-formats
 *
 * Nota bene: the order in which extensions are added sets their precedence
 * in the data cascade, the last added will take precedence over the first.
 * @see https://www.11ty.dev/docs/data-custom/#ordering-in-the-data-cascade
 *
 * @function addDataExtension
 * @see https://www.11ty.dev/docs/data-custom/#usage
 * @param {String} a comma-separated list of extensions
 * @param {Function|Options} a parse function or an options object
 *
 * @typedef {Object} Options - data extension options
 * @see https://www.11ty.dev/docs/data-custom/#usage-with-options
 * @property {Function} parser - the callback function used to parse the data
 * @property {Boolean} [read=true] - Using `read: false` changes the parser argument to a file path instead of file contents.
 * @property {String} [encoding='utf8'] - Node readFile encoding, use `null` to
 * create a `Buffer`
 */
module.exports = function(eleventyConfig, options) {
  /**
   * @see https://github.com/MikeKovarik/exifr#usage
   */
  eleventyConfig.addDataExtension('jpeg,jpg,png', {
    parser: async (file) => await exifr.parse(file),
    read: false
  })

  /**
   * @see https://github.com/json5/json5#json5parse
   */
  eleventyConfig.addDataExtension('json5', (content) => json5.parse(content))

  /**
   * @see https://github.com/BinaryMuse/toml-node#usage
   */
  eleventyConfig.addDataExtension('toml', (content) => toml.parse(content))

  /**
   * @see https://github.com/nodeca/js-yaml#load-string---options-
   * With `json: true` duplicate keys in a mapping will override values rather than throwing an error.
   */
  eleventyConfig.addDataExtension('yaml,yml', {
    parser: (content) => yaml.load(content, { json: false }),
    read: true
  })

  /**
   * @see https://geojson.org
   */
  eleventyConfig.addDataExtension('geojson', {
    parser: (contents) => JSON.parse(contents),
    read: true
  })
}
