const fs = require('fs')
const epubPlugin = require('./plugins/epub')
const iiifPlugin = require('./plugins/iiif')
const json5 = require('json5')
const markdown = require('./plugins/markdown')
const navigationPlugin = require('@11ty/eleventy-navigation')
const path = require('path')
const qFilters = require('./plugins/filters')
const qFrontmatter = require('./plugins/frontmatter')
const qShortcodes = require('./plugins/shortcodes')
const sass = require('sass')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const toml = require('toml')
const webpack = require('webpack')
const webpackProdConfig = require('./webpack/config.prod.js')
const webpackDevConfig = require('./webpack/config.dev.js')
const yaml = require('js-yaml')

/**
 * Eleventy configuration
 * @see {@link https://www.11ty.dev/docs/config/ Configuring 11ty}
 *
 * @param      {Object}  base eleventy configuration
 * @return     {Object}  A modified eleventy configuation
 */
module.exports = function(eleventyConfig) {
  const projectDir = 'src'

  /**
   * Ignore README.md when processing templates
   * @see {@link https://www.11ty.dev/docs/ignores/ Ignoring Template Files }
   */
  eleventyConfig.ignores.add('README.md')

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

  /**
   * Load plugin for custom configuration of the markdown library
   */
  eleventyConfig.addPlugin(markdown)

  /**
   * Load Quire template filters, frontmatter, and shortcodes with namespace
   */
  eleventyConfig.namespace('q', () => {
    eleventyConfig.addPlugin(qFilters)
    eleventyConfig.addPlugin(qFrontmatter)
    eleventyConfig.addPlugin(qShortcodes)
  })

  /**
   * Load additional plugins used for Quire projects
   */
  eleventyConfig.addPlugin(epubPlugin)
  eleventyConfig.addPlugin(iiifPlugin)
  eleventyConfig.addPlugin(navigationPlugin)
  eleventyConfig.addPlugin(syntaxHighlight)

  const compileBundle = (compiler) => {
    compiler.run((error) => {
      if (error) console.warn(error)
      compiler.close((closeError) => {
        if (closeError) console.warn(closeError)
      })
    });
  }
  /**
   * Compile webpack bundle once before build
   */
  eleventyConfig.on('beforeBuild', () => {
    const compiler = webpack(webpackProdConfig)
    compileBundle(compiler)
  });
  /**
   * compile webpack bundle with dev config when using --watch or --serve flags; this enables webpack to watch for changes to styles and scripts
   */
  eleventyConfig.on('beforeWatch', () => {
    const compiler = webpack(webpackDevConfig)
    compileBundle(compiler)
  })
  /**
   * Copy static assets to the output directory
   * @see {@link https://www.11ty.dev/docs/copy/ Passthrough copy in 11ty}
   */
  eleventyConfig.addPassthroughCopy('src/_assets')
  eleventyConfig.addPassthroughCopy('src/css')

  /**
   * Watch the following additional files for changes and live browsersync
   * @see @{@link https://www.11ty.dev/docs/config/#add-your-own-watch-targets Add your own watch targets in 11ty}
   */
  eleventyConfig.addWatchTarget('./**/*.css')
  eleventyConfig.addWatchTarget('./**/*.js')

  return {
    dir: {
      input: projectDir,
      output: '_site',
      // ⚠️ the following values are _relative_ to the `input` directory
      data: `./_data`,
      includes: '../_includes',
      layouts: '../_layouts',
    },
    /**
     * Suffix for template and directory specific data files
     * @example '.11tydata' will search for *.11tydata.js and *.11tydata.json data files.
     * @see [Template and Directory Specific Data Files](https://www.11ty.dev/docs/data-template-dir/)
     */
    jsDataFileSuffix: '.quire',
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
