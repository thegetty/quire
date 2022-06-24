const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')

const formatOutput = require('./format')
const transformForPDF = require('./pdf')

/**
 * An Eleventy plugin to configure output transforms
 *
 * @param      {Object}  eleventyConfig  Eleventy configuration
 * @param      {Object}  collections  Eleventy collections
 */
module.exports = function(eleventyConfig, collections) {
  /**
   * Registers a tranform to format output using Prettier
   */
  eleventyConfig.addTransform('format', formatOutput)

  /**
   * Plugin to combine output into a single HTML file for PDF generation
   */
  eleventyConfig.addPlugin(transformForPDF, { eleventyConfig, collections })
}
