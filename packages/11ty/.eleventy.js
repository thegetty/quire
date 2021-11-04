const epubPlugin = require('./plugins/epub')
const iiifPlugin = require('./plugins/iiif')
const json5 = require('json5')
const markdown = require('./plugins/markdown')
const navigationPlugin = require('@11ty/eleventy-navigation')
const path = require('path')
const qFilters = require('./plugins/filters')
const qFrontmatter = require('./plugins/frontmatter')
const qShortcodes = require('./plugins/shortcodes')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const toml = require('toml')
const yaml = require('js-yaml')

module.exports = function(eleventyConfig) {
  const projectDir = 'src'

  /**
   * Configure the Liquid template engine
   * @see https://www.11ty.dev/docs/languages/liquid/#liquid-options
   * @see https://github.com/11ty/eleventy/blob/master/src/Engines/Liquid.js
   *
   * @property {boolean} [dynamicPartials=false]
   * @property {boolean} [strictFilters=false]
   */
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
    strictFilters: true
  })

  /**
   * Custom data formats
   * Nota bene: the order in which extensions are added sets their precedence
   * in the data cascade, the last added will take precedence over the first.
   * @see https://www.11ty.dev/docs/data-cascade/
   * @see https://www.11ty.dev/docs/data-custom/#ordering-in-the-data-cascade
   */
  eleventyConfig.addDataExtension('json5', (contents) => json5.parse(contents))
  eleventyConfig.addDataExtension('toml', (contents) => toml.load(contents))
  eleventyConfig.addDataExtension('yaml', (contents) => yaml.load(contents))
  eleventyConfig.addDataExtension('geojson', (contents) => JSON.parse(contents))

  // load custom markdown configuration plugin
  eleventyConfig.addPlugin(markdown)

  eleventyConfig.namespace('q', () => {
    eleventyConfig.addPlugin(qFilters)
    eleventyConfig.addPlugin(qFrontmatter)
    eleventyConfig.addPlugin(qShortcodes)
  })

  eleventyConfig.addPlugin(epubPlugin)
  eleventyConfig.addPlugin(iiifPlugin)
  eleventyConfig.addPlugin(navigationPlugin)
  eleventyConfig.addPlugin(syntaxHighlight)

  // eleventyConfig.ignores.add('README.md')

  eleventyConfig.addPassthroughCopy(path.relative(projectDir, 'css'))
  eleventyConfig.addWatchTarget(path.relative(projectDir, 'css'))

  eleventyConfig.addPassthroughCopy(path.relative(projectDir, 'js'))
  eleventyConfig.addWatchTarget(path.relative(projectDir, 'js'))

  return {
    dir: {
      input: projectDir,
      output: 'site',
      // ⚠️ the following values are _relative_ to the `input` directory
      data: path.relative(projectDir, '_data'),
      includes: path.relative(projectDir, '_includes'),
      layouts: path.relative(projectDir, '_layouts')
    },
    /**
     * All of the following template formats support universal shortcodes.
     *
     * Nota bene:
     * Markdown files are pre-processed as Liquid templates by default. This
     * means that shortcodes available in Liquid templates are also available
     * in Markdown files. Likewise, if you change the template engine for
     * Markdown files, the shortcodes available for that templating language
     * will also be available in Markdown files.
     */
    templateFormats: [
      '11ty.js', // JavaScript
      'hbs',     // Handlebars
      'liquid',  // Liquid
      'md',      // Markdown
      'njk',     // Nunjucks
    ]
  }
}
