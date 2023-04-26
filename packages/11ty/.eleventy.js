require('module-alias/register')

const copy = require('rollup-plugin-copy')
const fs = require('fs-extra')
const packageJSON = require('./package.json');
const path = require('path')
const scss = require('rollup-plugin-scss')

const chalkFactory = require('~lib/chalk')

/**
 * Quire features are implemented as Eleventy plugins
 */
const {
  EleventyHtmlBasePlugin,
  EleventyRenderPlugin
} = require('@11ty/eleventy')
const citationsPlugin = require('~plugins/citations')
const collectionsPlugin = require('~plugins/collections')
const componentsPlugin = require('~plugins/components')
const dataExtensionsPlugin = require('~plugins/dataExtensions')
const directoryOutputPlugin = require('@11ty/eleventy-plugin-directory-output')
const figuresPlugin = require('~plugins/figures')
const filtersPlugin = require('~plugins/filters')
const frontmatterPlugin = require('~plugins/frontmatter')
const globalDataPlugin = require('~plugins/globalData')
const i18nPlugin = require('~plugins/i18n')
const lintersPlugin = require('~plugins/linters')
const markdownPlugin = require('~plugins/markdown')
const navigationPlugin = require('@11ty/eleventy-navigation')
const pluginWebc = require('@11ty/eleventy-plugin-webc')
const searchPlugin = require('~plugins/search')
const shortcodesPlugin = require('~plugins/shortcodes')
const syntaxHighlightPlugin = require('@11ty/eleventy-plugin-syntaxhighlight')
const transformsPlugin = require('~plugins/transforms')
const vitePlugin = require('~plugins/vite')

const { error } = chalkFactory('eleventy config')

const inputDir = process.env.ELEVENTY_INPUT || 'content'
const outputDir = process.env.ELEVENTY_OUTPUT || '_site'
const publicDir = process.env.ELEVENTY_ENV === 'production' ? 'public' : false // publicDir should be set explicitly to false in development 

/**
 * Eleventy configuration
 * @see {@link https://www.11ty.dev/docs/config/ Configuring 11ty}
 *
 * @param      {Object}  base eleventy configuration
 * @return     {Object}  A modified eleventy configuation
 */
module.exports = function(eleventyConfig) {
  /**
   * Override addPassthroughCopy to use _absolute_ system paths.
   * @see https://www.11ty.dev/docs/copy/#passthrough-file-copy
   * Nota bene: Eleventy addPassthroughCopy assumes paths are _relative_
   * to the `config` file however the quire-cli separates 11ty from the
   * project directory (`input`) and needs to use absolute system paths.
   */
  // @TODO Fix path resolution issue, disabling for now
  // const addPassthroughCopy = eleventyConfig.addPassthroughCopy.bind(eleventyConfig)
  //
  // eleventyConfig.addPassthroughCopy = (entry) => {
  //   if (typeof entry === 'string') {
  //     const filePath = path.resolve(entry)
  //     console.debug('[11ty:config] passthrough copy %s', filePath)
  //     return addPassthroughCopy(filePath, { expand: true })
  //   } else {
  //     console.debug('[11ty:config] passthrough copy %o', entry)
  //     entry = Object.fromEntries(
  //       Object.entries(entry).map(([ src, dest ]) => {
  //         return [
  //           path.join(__dirname, src),
  //           path.resolve(path.join(outputDir, dest))
  //         ]
  //       })
  //     )
  //     console.debug('[11ty:config] passthrough copy %o', entry)
  //     return addPassthroughCopy(entry, { expand: true })
  //   }
  // }

  eleventyConfig.addGlobalData('application', {
    name: 'Quire',
    version: packageJSON.version
  })

  /**
   * Ignore README files when processing templates
   * @see {@link https://www.11ty.dev/docs/ignores/ Ignoring Template Files }
   */
  eleventyConfig.ignores.add('**/README.md')

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
   * Configure build output
   * @see https://www.11ty.dev/docs/plugins/directory-output/#directory-output
   */
  eleventyConfig.setQuietMode(true)
  eleventyConfig.addPlugin(directoryOutputPlugin)

  /**
   * @see https://www.11ty.dev/docs/plugins/html-base/
   */
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin)

  /**
   * Plugins are loaded in this order: 
   *   1) immediately invoked
   *   2) addPlugin statements
   * Plugins that mutate globalData must be added before other plugins
   *
   * Note: The config does **not** have access to collections or global,
   * to get around this we invoke some plugins immediately and return a value
   * so that data can be provided to the config or another plugin.
   */
  dataExtensionsPlugin(eleventyConfig)
  const globalData = globalDataPlugin(eleventyConfig, { inputDir, outputDir, publicDir })
  const collections = collectionsPlugin(eleventyConfig)
  vitePlugin(eleventyConfig, globalData)

  eleventyConfig.addPlugin(i18nPlugin)
  eleventyConfig.addPlugin(figuresPlugin)

  /**
   * Load plugin for custom configuration of the markdown library
   */
  eleventyConfig.addPlugin(markdownPlugin)

  /**
   * Load plugins for the Quire template shortcodes and filters
   */
  eleventyConfig.addPlugin(componentsPlugin, collections)
  eleventyConfig.addPlugin(filtersPlugin)
  eleventyConfig.addPlugin(frontmatterPlugin)
  eleventyConfig.addPlugin(shortcodesPlugin, collections)

  /**
   * Load additional plugins used for Quire projects
   */
  eleventyConfig.addPlugin(citationsPlugin)
  eleventyConfig.addPlugin(navigationPlugin)
  eleventyConfig.addPlugin(searchPlugin, collections)
  eleventyConfig.addPlugin(syntaxHighlightPlugin)

  /**
   * Add shortcodes to render an Eleventy template inside of another template,
   * allowing JavaScript, Liquid, and Nunjucks templates to be freely mixed.
   * @see {@link https://www.11ty.dev/docs/_plugins/render/}
   */
  eleventyConfig.addPlugin(EleventyRenderPlugin)

  /**
   * Add plugin for WebC support
   * @see https://www.11ty.dev/docs/languages/webc/#installation
   *
   * @typedef {PluginWebcOptions}
   * @property {String} components - Glob pattern for no-import global components
   * @property {Object} transformData - Additional global data for WebC transform
   * @property {Boolean} useTransform - Use WebC transform to process all HTML output
   */
  eleventyConfig.addPlugin(pluginWebc, {
    components: '_includes/components/**/*.webc',
    transformData: {},
    useTransform: false,
  })

  /**
   * Register a plugin to run linters on input templates
   * Nota bene: linters are run *before* applying layouts
   */
  eleventyConfig.addPlugin(lintersPlugin)

  /**
   * Register plugin to run tranforms on build output
   */
  eleventyConfig.addPlugin(transformsPlugin, collections)

  /**
   * Set eleventy dev server options
   * @see https://www.11ty.dev/docs/dev-server/
   */
  eleventyConfig.setServerOptions({
    port: 8080
  })

  // @see https://www.11ty.dev/docs/copy/#passthrough-during-serve
  // @todo resolve error when set to the default behavior 'passthrough'
  eleventyConfig.setServerPassthroughCopyBehavior('copy')

  /**
   * Copy static assets to the output directory
   * @see https://www.11ty.dev/docs/copy/
   */
  if (process.env.ELEVENTY_ENV === 'production') eleventyConfig.addPassthroughCopy(publicDir)
  eleventyConfig.addPassthroughCopy(`${inputDir}/_assets`)
  eleventyConfig.addPassthroughCopy({ '_includes/web-components': '_assets/javascript' })

  /**
   * Watch the following additional files for changes and rerun server
   * @see https://www.11ty.dev/docs/config/#add-your-own-watch-targets
   * @see https://www.11ty.dev/docs/watch-serve/#ignore-watching-files
   */
  eleventyConfig.addWatchTarget('./**/*.css')
  eleventyConfig.addWatchTarget('./**/*.js')
  eleventyConfig.addWatchTarget('./**/*.scss')

  /**
   * Ignore changes to programmatic build artifacts
   * @see https://www.11ty.dev/docs/watch-serve/#ignore-watching-files
   * @todo refactor to move these statements to the tranform plugins
   */
  eleventyConfig.watchIgnores.add('_epub')
  eleventyConfig.watchIgnores.add('_pdf')
  eleventyConfig.watchIgnores.add('_temp')

  const { pathname: pathPrefix } = globalData.publication
  return {
    /**
     * @see {@link https://www.11ty.dev/docs/config/#configuration-options}
     */
    dir: {
      // ⚠️ input and output dirs are _relative_ to the `.eleventy.js` module
      input: inputDir,
      output: outputDir,
      // ⚠️ the following directories are _relative_ to the `input` directory
      data: process.env.ELEVENTY_DATA || '_computed',
      includes: process.env.ELEVENTY_INCLUDES || path.join('..', '_includes'),
      layouts: process.env.ELEVENTY_LAYOUTS || path.join('..', '_layouts'),
    },
    /**
     * The default global template engine to pre-process HTML files.
     * Use false to avoid pre-processing and passthrough copy the content (HTML is not transformed, so technically this could be any plaintext).
     * @see {@link https://www.11ty.dev/docs/config/#default-template-engine-for-html-files}
     */
    htmlTemplateEngine: 'liquid',
    /**
     * Suffix for template and directory specific data files
     * @example '.data' will search for `*.data.js` and `*.data.json` data files.
     * @see {@link https://www.11ty.dev/docs/data-template-dir/ Template and Directory Specific Data Files}
     */
    jsDataFileSuffix: '.data',
    /**
     * The default global template engine to pre-process markdown files.
     * Use false to avoid pre-processing and only transform markdown.
     * @see {@link https://www.11ty.dev/docs/config/#default-template-engine-for-markdown-files}
     */
    markdownTemplateEngine: 'liquid',
    /**
     * @see {@link https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix}
     */
    pathPrefix,
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
