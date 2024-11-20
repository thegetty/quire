const copy = require('rollup-plugin-copy')
const path = require('path')
const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite')

/**
 * Use Vite to bundle JavaScript
 * @see https://github.com/11ty/eleventy-plugin-vite
 *
 * Runs Vite as Middleware in the Eleventy Dev Server
 * Runs Vite build to postprocess the Eleventy build output
 *
 * @param {Object} eleventyConfig
 * @param {Object} globalData
 */
module.exports = function (eleventyConfig, { directoryConfig, publication }) {
  const { pathname } = publication
  const { inputDir, outputDir, publicDir } = directoryConfig

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: '.11ty-vite',
    viteOptions: {
      publicDir,
      /**
       * @see https://vitejs.dev/config/#build-options
       */
      root: outputDir,
      base: pathname, 
      resolve: {
        alias: pathname === '/' ? [] : [{ find: pathname, replacement: '/' }]
      },
      build: {
        assetsDir: '_assets',
        emptyOutDir: process.env.ELEVENTY_ENV !== 'production',
        manifest: true,
        mode: 'production',
        outDir: outputDir,
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
                { 
                  src: 'public/*', 
                  dest: outputDir,
                },
                {
                  src: path.join(inputDir, '_assets', 'images', '*'),
                  dest: path.join(outputDir, '_assets', 'images')
                },
                {
                  src: path.join(inputDir, '_assets', 'downloads', '*'),
                  dest: path.join(outputDir, '_assets', 'downloads')
                },
                {
                  src: path.join(inputDir, '_assets', 'fonts', '*'),
                  dest: path.join(outputDir, '_assets', 'fonts')
                }
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
}
