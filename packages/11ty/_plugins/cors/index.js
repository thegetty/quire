/**
 * CORS Config
 * @todo Update when upgrading to 11ty v2.0
 * See: https://www.11ty.dev/docs/watch-serve/#eleventy-dev-server
 */
module.exports = function(eleventyConfig, options) {
  const { globalData } = eleventyConfig
  eleventyConfig.setBrowserSyncConfig({
    cors: globalData.env.ELEVENTY_ENV === 'development'
  })
}
