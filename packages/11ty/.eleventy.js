const { EleventyRenderPlugin } = require('@11ty/eleventy')
const componentsPlugin = require('./plugins/components')
const fs = require('fs')
const epubPlugin = require('./plugins/epub')
const iiifPlugin = require('./plugins/iiif')
const json5 = require('json5')
const lintingPlugin = require('./plugins/linting')
const markdownPlugin = require('./plugins/markdown')
const navigationPlugin = require('@11ty/eleventy-navigation')
const path = require('path')
const qFiltersPlugin = require('./plugins/filters')
const qFrontmatterPlugin = require('./plugins/frontmatter')
const qShortcodesPlugin = require('./plugins/shortcodes')
const sass = require('sass')
const syntaxHighlightPlugin = require('@11ty/eleventy-plugin-syntaxhighlight')
const toml = require('toml')
const yaml = require('js-yaml')

/**
 * Eleventy configuration
 * @see {@link https://www.11ty.dev/docs/config/ Configuring 11ty}
 *
 * @param      {Object}  base eleventy configuration
 * @return     {Object}  A modified eleventy configuation
 */
module.exports = function(eleventyConfig) {
  const projectDir = 'content'

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
   * Add Quire configuration to global data
   *
   * @todo refactor this to look for a configuration file
   * in order of preference:
   *
   * Quire < 1.0
   *  <projectDir>/config.yml
   *
   * Quire >= 1.0
   *  <projectDir>/<dataDir>/.quire.config.js
   *  <projectDir>/.quire.config.js
   *  ./.quire.config.js
   *  ./config.[js|json|ya?ml]
   */
  eleventyConfig.addGlobalData('config', require('./config.yml'))

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
  eleventyConfig.addPlugin(markdownPlugin)

  /**
   * Load Quire template filters, frontmatter, and shortcodes with namespace
   */
  eleventyConfig.namespace('q', () => {
    eleventyConfig.addPlugin(qFrontmatterPlugin)
    eleventyConfig.addPlugin(qShortcodesPlugin)
  })

  eleventyConfig.addPlugin(qFiltersPlugin)

  /**
   * Load additional plugins used for Quire projects
   */
  eleventyConfig.addPlugin(componentsPlugin)
  eleventyConfig.addPlugin(lintingPlugin)
  eleventyConfig.addPlugin(epubPlugin)
  eleventyConfig.addPlugin(iiifPlugin)
  eleventyConfig.addPlugin(navigationPlugin)
  eleventyConfig.addPlugin(syntaxHighlightPlugin)

  /**
   * Add shortcodes to render an Eleventy template inside of another template,
   * allowing JavaScript, Liquid, and Nunjucks templates to be freely mixed.
   * @see {@link https://www.11ty.dev/docs/plugins/render/}
   */
  eleventyConfig.addPlugin(EleventyRenderPlugin)

  /**
   * Copy static assets to the output directory
   * @see {@link https://www.11ty.dev/docs/copy/ Passthrough copy in 11ty}
   */
  eleventyConfig.addPassthroughCopy('src/_assets')
  eleventyConfig.addPassthroughCopy('src/css/**')
  eleventyConfig.addPassthroughCopy('src/js/**')

  /**
   * Watch the following additional files for changes and live browsersync
   * @see @{@link https://www.11ty.dev/docs/config/#add-your-own-watch-targets Add your own watch targets in 11ty}
   */
  eleventyConfig.addWatchTarget('./**/*.css')
  eleventyConfig.addWatchTarget('./**/*.js')

  return {
    /**
     * @see {@link https://www.11ty.dev/docs/config/#configuration-options}
     */
    dir: {
      input: projectDir,
      output: '_site',
      // ⚠️ the following values are _relative_ to the `input` directory
      data: `./_data`,
      includes: '../_includes',
      layouts: '../_layouts',
    },
    /**
     * The default global template engine to pre-process HTML files.
     * Use false to avoid pre-processing and passthrough copy the content (HTML is not transformed, so technically this could be any plaintext).
     * @see {@link https://www.11ty.dev/docs/config/#default-template-engine-for-html-files}
     */
    htmlTemplateEngine: 'liquid',
    /**
     * Suffix for template and directory specific data files
     * @example '.11tydata' will search for *.11tydata.js and *.11tydata.json data files.
     * @see [Template and Directory Specific Data Files](https://www.11ty.dev/docs/data-template-dir/)
     */
    jsDataFileSuffix: '.quire',
    /**
     * The default global template engine to pre-process markdown files.
     * Use false to avoid pre-processing and only transform markdown.
     * @see {@link https://www.11ty.dev/docs/config/#default-template-engine-for-markdown-files}
     */
    markdownTemplateEngine: 'njk',
    /**
     * @see {@link https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix}
     */
    pathPrefix: '/',
    /**
     * All of the following template formats support universal shortcodes.
     *
     * Nota bene:
     * Markdown files are pre-processed as Liquid templates by default. This
     * means that shortcodes available in Liquid templates are also available
     * in Markdown files. Likewise, if you change the template engine for
     * Markdown files, the shortcodes available for that templating language
     * will also be available in Markdown files.
     * @see {@link https://www.11ty.dev/docs/config/#template-formats}
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
