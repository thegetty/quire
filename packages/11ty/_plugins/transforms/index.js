const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')

const formatOutput = require('./format')
const outputs = require('./outputs')
const webComponents = require('./web-components')

/**
 * An Eleventy plugin to configure output transforms
 *
 * @param      {Object}  eleventyConfig  Eleventy configuration
 * @param      {Object}  collections  Eleventy collections
 */
module.exports = function(eleventyConfig, collections) {
  /**
   * Registers a transform to format output using Prettier
   */
  eleventyConfig.addTransform('format', formatOutput)
  /**
   * Registers a transform to register web component modules in document `<head>`
   */
  eleventyConfig.addTransform('web-components', webComponents)

  /**
   * Register plugin to generate output for epub, html, and pdf using `transforms`
   */
  eleventyConfig.addPlugin(outputs, { eleventyConfig, collections })
}
