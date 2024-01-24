import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'node:path'

import formatOutput from './format'
import outputs from './outputs'

/**
 * An Eleventy plugin to configure output transforms
 *
 * @param      {Object}  eleventyConfig  Eleventy configuration
 * @param      {Object}  collections  Eleventy collections
 */
export default function(eleventyConfig, collections) {
  /**
   * Registers a transform to format output using Prettier
   */
  eleventyConfig.addTransform('format', formatOutput)

  /**
   * Register plugin to generate output for epub, html, and pdf using `transforms`
   */
  eleventyConfig.addPlugin(outputs, { eleventyConfig, collections })
}
