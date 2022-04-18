/**
 * CORS Config
 * @todo Browsersync is deprecated in Eleventy 2.0
 * @see https://www.11ty.dev/docs/watch-serve/#browsersync
 */
module.exports = function(eleventyConfig, options) {
  const { globalData } = eleventyConfig
  eleventyConfig.setBrowserSyncConfig({
    cors: globalData.env.ELEVENTY_ENV === 'development'
  })
}
