/**
 * CORS Config
 */
module.exports = function(eleventyConfig, options) {
  const { globalData } = eleventyConfig
  eleventyConfig.setServerOptions({
    module: '@11ty/eleventy-server-browsersync',
    cors: globalData.env.ELEVENTY_ENV === 'development'
  })
}
