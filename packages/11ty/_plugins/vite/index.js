import EleventyVitePlugin from '@11ty/eleventy-plugin-vite'
import copy from 'rollup-plugin-copy'
import path from 'node:path'

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
export default function (eleventyConfig, { directoryConfig, publication }) {
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
        alias: pathname === '/' ? {} : { [pathname]: '/' }
      },
      build: {
        assetsDir: '_assets',
        emptyOutDir: process.env.ELEVENTY_ENV !== 'production',
        manifest: true,
        mode: 'production',
        outDir: outputDir,
        rollupOptions: {
          output: {
            assetFileNames: ({ name, originalFileName }) => {
              const fullFilePathSegments = (originalFileName ?? name).split('/').slice(0, -1)
              let filePath = '_assets/';
              ['_assets', 'node_modules'].forEach((assetDir) => {
                if (fullFilePathSegments.includes(assetDir)) {
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
                  dest: outputDir
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
       * Configure style pre-procssing
       * @see https://vite.dev/config/shared-options#css-preprocessoroptions
       * @see https://sass-lang.com/documentation/js-api/interfaces/options/
       */
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern-compiler',
            silenceDeprecations: [
              'color-functions',
              'global-builtin',
              'import',
              'legacy-js-api',
              'mixed-decls'
            ]
          }
        }
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
