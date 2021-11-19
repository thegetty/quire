const { defineConfig } = require('vite')

/**
 * @see {@link https://vitejs.dev/config/ Configuring Vite}
 */
module.exports = defineConfig({
  /**
   * @see {@link https://vitejs.dev/config/#build-options}
   */
  build: {
    /**
     * Specify the assets directory relative to project root
     */
    assetsDir: '_assets',
    /**
     * Generate a manifest.json file the output directory
     */
    manifest: true,
    /**
     * Specify the output directory relative to project root
     */
    // outDir: '',
    /**
     *
     */
    sourcemap: true
  },
  /**
   * Render Eleventy output in the console alongside Vite output
   */
  clearScreen: false,
  /**
   * Project root directory
   * This can be an absolute path, or a path relative to the location of the config file itself.
   * The root directory is the Quire content/Eleventy input directory
   */
  root: './_site'
})
