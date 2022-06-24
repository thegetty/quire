const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const transform = require('./transform')

/**
 * Eleventy plugin to output HTML specific for PDF generation
 *
 * @param      {Object}  eleventyConfig  Eleventy configuration
 * @param      {Object}  collections  Eleventy collections
 */
module.exports = function(eleventyConfig, { collections }) {
  const outputDir = eleventyConfig.dir.output

  /**
   * Nota bene:
   * call transform with `this` context to ensure we have `this.outputPath`
   */
  eleventyConfig.addTransform('pdf', function (content) {
    return transform.call(this, collections, content)
  })
}
