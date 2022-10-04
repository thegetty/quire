require('module-alias/register')

const copy = require('rollup-plugin-copy')
const fs = require('fs-extra')
const path = require('path')
const scss = require('rollup-plugin-scss')

/**
 * Quire features are implemented as Eleventy plugins
 */
const {
  EleventyHtmlBasePlugin,
  EleventyRenderPlugin
} = require('@11ty/eleventy')
const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite')
const directoryOutputPlugin = require('@11ty/eleventy-plugin-directory-output')
const citationsPlugin = require('~plugins/citations')
const collectionsPlugin = require('~plugins/collections')
const componentsPlugin = require('~plugins/components')
const dataExtensionsPlugin = require('~plugins/dataExtensions')
const figuresPlugin = require('~plugins/figures')
const filtersPlugin = require('~plugins/filters')
const frontmatterPlugin = require('~plugins/frontmatter')
const globalDataPlugin = require('~plugins/globalData')
const i18nPlugin = require('~plugins/i18n')
const lintersPlugin = require('~plugins/linters')
const markdownPlugin = require('~plugins/markdown')
const navigationPlugin = require('@11ty/eleventy-navigation')
const searchPlugin = require('~plugins/search')
const shortcodesPlugin = require('~plugins/shortcodes')
const syntaxHighlightPlugin = require('@11ty/eleventy-plugin-syntaxhighlight')
const transformsPlugin = require('~plugins/transforms')

const inputDir = 'content'
const outputDir = '_site'
const publicDir = 'public'

/**
 * Eleventy configuration
 * @see {@link https://www.11ty.dev/docs/config/ Configuring 11ty}
 *
 * @param      {Object}  base eleventy configuration
 * @return     {Object}  A modified eleventy configuation
 */
module.exports = function(eleventyConfig) {
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
  // eleventyConfig.addPlugin(EleventyHtmlBasePlugin, {
  //   baseHref: eleventyConfig.pathPrefix
  // })

  /**
   * Plugins are loaded in order of the `addPlugin` statements,
   * plugins that mutate globalData must be added before other plugins
   */
  eleventyConfig.addPlugin(dataExtensionsPlugin)
  eleventyConfig.addPlugin(globalDataPlugin)
  eleventyConfig.addPlugin(i18nPlugin)
  eleventyConfig.addPlugin(figuresPlugin)

  /**
   * Load plugin for custom configuration of the markdown library
   */
  eleventyConfig.addPlugin(markdownPlugin)

  /**
   * Add collections
   */
  const collections = collectionsPlugin(eleventyConfig)

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
  eleventyConfig.addPlugin(searchPlugin)
  eleventyConfig.addPlugin(syntaxHighlightPlugin)

  /**
   * Add shortcodes to render an Eleventy template inside of another template,
   * allowing JavaScript, Liquid, and Nunjucks templates to be freely mixed.
   * @see {@link https://www.11ty.dev/docs/_plugins/render/}
   */
  eleventyConfig.addPlugin(EleventyRenderPlugin)

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
   * Use Vite to bundle JavaScript
   * @see https://github.com/11ty/eleventy-plugin-vite
   *
   * Runs Vite as Middleware in the Eleventy Dev Server
   * Runs Vite build to postprocess the Eleventy build output
   */
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: '.11ty-vite',
    viteOptions: {
      publicDir: process.env.ELEVENTY_ENV === 'production'
        ? publicDir
        : false,
      /**
       * @see https://vitejs.dev/config/#build-options
       */
      root: '_site',
      build: {
        assetsDir: '_assets',
        emptyOutDir: process.env.ELEVENTY_ENV !== 'production',
        manifest: true,
        mode: 'production',
        outDir: '_site',
        rollupOptions: {
          output: {
            assetFileNames: ({ name }) => {
              const fullFilePathSegments = name.split('/').slice(0, -1)
              let filePath = '_assets/';
              ['_assets', 'node_modules'].forEach((assetDir) => {
                if (name.includes(assetDir)) {
                  filePath +=
                    fullFilePathSegments
                      .slice(fullFilePathSegments.indexOf(assetDir) + 1)
                      .join('/') + '/'
                }
              })
              return `${filePath}[name][extname]`
            }
          },
          plugins: [
            copy({
              targets: [
                { src: 'public/pdf.html', dest: '_site' },
                { src: 'public/pdf.css', dest: '_site' },
              ]
            })
          ]
        },
        sourcemap: true
      },
      /**
       * Set to false to prevent Vite from clearing the terminal screen
       * and have Vite logging messages rendered alongside Eleventy output.
       */
      clearScreen: false,
      /**
       * @see https://vitejs.dev/config/#server-host
       */
      server: {
        hmr: {
          overlay: false
        },
        middlewareMode: true,
        mode: 'development'
      }
    }
  })

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
   * Watch the following additional files for changes and live browsersync
   * @see @{@link https://www.11ty.dev/docs/config/#add-your-own-watch-targets Add your own watch targets in 11ty}
   */
  eleventyConfig.addWatchTarget('./**/*.css')
  eleventyConfig.addWatchTarget('./**/*.js')
  eleventyConfig.addWatchTarget('./**/*.scss')

  return {
    /**
     * @see {@link https://www.11ty.dev/docs/config/#configuration-options}
     */
    dir: {
      input: inputDir,
      output: outputDir,
      // ⚠️ the following values are _relative_ to the `input` directory
      data: `./_computed`,
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
    markdownTemplateEngine: 'liquid',
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
