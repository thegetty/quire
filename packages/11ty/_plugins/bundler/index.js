const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite')
const copy = require('rollup-plugin-copy')
const scss = require('rollup-plugin-scss')

/**
 * Configure Vite to bundle JavaScript and process the build output
 * @see https://github.com/11ty/eleventy-plugin-vite
 *
 * Runs Vite as Middleware in the Eleventy Dev Server.
 * Runs Vite build to postprocess the Eleventy build output.
 *
 * @param  {EleventyConfig}  eleventyConfig
 * @param  {Object}  options - must include `dirs` configuration
 */
module.exports = function (eleventyConfig, { dirs }) {
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: '.11ty-vite',
    viteOptions: {
      publicDir: process.env.ELEVENTY_ENV === 'production' ? dirs.public : false,
      /**
       * @see https://vitejs.dev/config/#build-options
       */
      root: dirs.output,
      build: {
        assetsDir: dirs.assets,
        emptyOutDir: process.env.ELEVENTY_ENV !== 'production',
        manifest: true,
        mode: 'production',
        outDir: dirs.output,
        rollupOptions: {
          output: {
            assetFileNames: ({ name }) => {
              const fullFilePathSegments = name.split('/').slice(0, -1)
              let filePath = dirs.assets
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
                { src: `${dirs.public}/pdf.html`, dest: dirs.output },
                { src: `${dirs.public}/pdf.css`, dest: dirs.output },
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
