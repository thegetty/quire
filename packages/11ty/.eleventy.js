require('dotenv').config()
require('module-alias/register')

const fs = require('fs-extra')
const path = require('path')
const scss = require('rollup-plugin-scss')

/**
 * Quire features are implemented as Eleventy plugins
 */
const { EleventyRenderPlugin } = require('@11ty/eleventy')
const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite')
const directoryOutputPlugin = require('@11ty/eleventy-plugin-directory-output')
const citationsPlugin = require('./_plugins/citations')
const collectionsPlugin = require('./_plugins/collections')
const componentsPlugin = require('./_plugins/components')
const filtersPlugin = require('./_plugins/filters')
const frontmatterPlugin = require('./_plugins/frontmatter')
const globalDataPlugin = require('./_plugins/globalData')
const iiifPlugin = require('./_plugins/iiif')
const lintersPlugin = require('./_plugins/linters')
const markdownPlugin = require('./_plugins/markdown')
const navigationPlugin = require('@11ty/eleventy-navigation')
const searchPlugin = require('./_plugins/search')
const shortcodesPlugin = require('./_plugins/shortcodes')
const syntaxHighlightPlugin = require('@11ty/eleventy-plugin-syntaxhighlight')
const transformsPlugin = require('./_plugins/transforms')

/**
 * Parsing libraries for additional data file formats
 */
const json5 = require('json5')
const toml = require('toml')
const yaml = require('js-yaml')

const inputDir = 'content'
const outputDir = '_site'

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

  eleventyConfig.addGlobalData('env', process.env);
  /**
   * Configure build output
   * @see https://www.11ty.dev/docs/plugins/directory-output/#directory-output
   */
  eleventyConfig.setQuietMode(true)
  eleventyConfig.addPlugin(directoryOutputPlugin)

  /**
   * Load plugins that add to eleventyConfig.globalData
   * Must go before other plugins
   */
  eleventyConfig.addPlugin(globalDataPlugin)
  eleventyConfig.addPlugin(iiifPlugin)

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
      /**
       * @see https://vitejs.dev/config/#build-options
       */
      root: '_site',
      build: {
        assetsDir: '_assets',
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
                      .join('/') +
                    '/'
                }
              })
              return `${filePath}[name][extname]`
            }
          }
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
        middlewareMode: 'ssr',
        mode: 'development'
      }
    }
  })

  // @see https://www.11ty.dev/docs/copy/#passthrough-during-serve
  // @todo resolve error when set to the default behavior 'passthrough'
  eleventyConfig.setServerPassthroughCopyBehavior('copy')

  /**
   * Copy static assets to the output directory
   * @see https://www.11ty.dev/docs/copy/
   */
  eleventyConfig.addPassthroughCopy('content/_assets')
  eleventyConfig.addPassthroughCopy('public')

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
