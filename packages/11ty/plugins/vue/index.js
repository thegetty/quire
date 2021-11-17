const eleventyVue = require('@11ty/eleventy-plugin-vue')

/**
 * Eleventy plugin to configure the Elevent Vue Plugin
 * @see {@link https://github.com/11ty/eleventy-plugin-vue}
 *
 * @param      {Object}  eleventyConfig  The eleventy configuration
 */
module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyVue, {
    /**
     * Directory to store compiled Vue single file components
     */
    cacheDirectory: '.cache/vue/',
    /**
     * Limit compilation to an array .vue files
     * If input is empty, the plugin will search for all *.vue files
     */
    input: [],
    /**
     * Use postcss for Vue single file components
     */
    rollupPluginVueOptions: {
      style: {
        postcssPlugins: [
          require('autoprefixer'),
          require('postcss-nested')
        ]
      }
    },
    /**
     * Configuration passed to `rollup.rollup`
     * @see {@link https://rollup-plugin-vue.vuejs.org/options.html#include}
     */
    rollupOptions: {
      // external dependencies
      external: []
    },
  })
}
