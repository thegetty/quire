import fs from 'fs-extra'
import path from 'node:path'

/**
 * Eleventy plugins
 */
import {
  EleventyHtmlBasePlugin,
  IdAttributePlugin,
  InputPathToUrlTransformPlugin,
  EleventyRenderPlugin
} from '@11ty/eleventy'
// import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'
import directoryOutputPlugin from '@11ty/eleventy-plugin-directory-output'
import navigationPlugin from '@11ty/eleventy-navigation'
import pluginWebc from '@11ty/eleventy-plugin-webc'
import syntaxHighlightPlugin from '@11ty/eleventy-plugin-syntaxhighlight'

/**
 * Quire plugins for Eleventy
 * dynamic import of the default export from local plugins modules
 */
// const plugins =
//   fs.readdir('_plugins', { withFileTypes: true }, (error, entries) => {
//     entries.forEach((entry) => {
//       if (entry.isDirectory()) {
//         const { default: plugin } = await import(`./plugins/${entry.name}`)
//         eleventyConfig.addPlugin(plugin, collections)
//       }
//     })
//   })
import citationsPlugin from '#plugins/citations/index.js'
import collectionsPlugin from '#plugins/collections/index.js'
import componentsPlugin from '#plugins/components/index.js'
import dataExtensionsPlugin from '#plugins/dataExtensions/index.js'
import figuresPlugin from '#plugins/figures/index.js'
import filtersPlugin from '#plugins/filters/index.js'
import frontmatterPlugin from '#plugins/frontmatter/index.js'
import globalDataPlugin from '#plugins/globalData/index.js'
import i18nPlugin from '#plugins/i18n/index.js'
import lintersPlugin from '#plugins/linters/index.js'
import markdownPlugin from '#plugins/markdown/index.js'
import searchPlugin from '#plugins/search/index.js'
import shortcodesPlugin from '#plugins/shortcodes/index.js'
import sitemapPlugin from '#plugins/sitemap/index.js'
import transformsPlugin from '#plugins/transforms/index.js'
import vitePlugin from '#plugins/vite/index.js'

/**
 * Application modules
 */
import chalkFactory from '#lib/chalk/index.js'

// Read package.json manually for now, see: https://github.com/11ty/eleventy/issues/3128
// When issue merged, use: import packageJSON from './package.json' with { type: 'json' };
const packageJSON = JSON.parse(
  (await fs.readFile(new URL('package.json', import.meta.url))).toString()
)

// eslint-disable-next-line no-unused-vars
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
export default async function (eleventyConfig) {
  const dataDir = process.env.ELEVENTY_DATA || '_computed'
  const includesDir = process.env.ELEVENTY_INCLUDES || path.join('..', '_includes')
  const layoutsDir = process.env.ELEVENTY_LAYOUTS || path.join('..', '_layouts')

  // ⚠️ input and output dirs are _relative_ to the `.eleventy.js` module
  eleventyConfig.setInputDirectory(inputDir)
  eleventyConfig.setOutputDirectory(outputDir)
  // ⚠️ the following directories are _relative_ to the `input` directory
  eleventyConfig.setDataDirectory(dataDir)
  eleventyConfig.setIncludesDirectory(includesDir)
  eleventyConfig.setLayoutsDirectory(layoutsDir)

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
  eleventyConfig.setTemplateFormats([
    '11ty.js', // JavaScript
    'html', // HTML
    'liquid', // Liquid
    'md', // Markdown
    'njk' // Nunjucks
  ])

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
   * Register a preprocessor to ignore HTML files from the input asset directory.
   * Preprocessors run on input templates before parsing.
   * @see https://www.11ty.dev/docs/config-preprocessors/
   *
   * NB: `inputPath` is normalized to URL path separators (`/`) not the platform's separator
   */
  const assetPathFragment = [inputDir, '_assets'].join('/')
  const ignoreAssetHTML = ({ page }, content) => {
    if (page.inputPath.includes(assetPathFragment)) return false
    return content
  }

  eleventyConfig.addPreprocessor('html-files', 'html', ignoreAssetHTML)

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
   * @see https://www.11ty.dev/docs/plugins/id-attribute/
   */
  eleventyConfig.addPlugin(IdAttributePlugin)

  /**
   * @see https://www.11ty.dev/docs/plugins/inputpath-to-url/
   */
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin)

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
  eleventyConfig.addPlugin(componentsPlugin)
  eleventyConfig.addPlugin(filtersPlugin)
  eleventyConfig.addPlugin(frontmatterPlugin)
  eleventyConfig.addPlugin(shortcodesPlugin)

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

  // Uses RenderPlugin so must load second
  sitemapPlugin(eleventyConfig, collections)

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
    components: [
      '_includes/components/**/*.webc',
      'npm:@11ty/eleventy-img/*.webc'
    ],
    transformData: {},
    useTransform: false
  })

  /**
   * Configure the Eleventy Image plugin
   * @see https://www.11ty.dev/docs/plugins/image/
   */
  // eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
  //   defaultAttributes: {
  //     decoding: 'async',
  //     loading: 'lazy'
  //   },
  //   filenameFormat:  (id, src, width, format, options) => {
  //     const extension = path.extname(src)
  //     const name = path.basename(src, extension)
  //     return `${name}-${width}w.${format}`
  //   },
  //   formats: ['jpeg'],
  //   outputDir: '.',
  //   urlPath: '/img/'
  // })

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

  /**
   * Suffix for template and directory specific data files
   * @example '.data' will search for `*.data.js` and `*.data.json` data files
   * @see https://www.11ty.dev/docs/config/#change-base-file-name-for-data-files
   * @see https://www.11ty.dev/docs/config/#change-file-suffix-for-data-files
   */
  eleventyConfig.setDataFileBaseName('index')
  eleventyConfig.setDataFileSuffixes(['.data', ''])

  const { pathname } = globalData.publication

  return { pathPrefix: pathname }
}
