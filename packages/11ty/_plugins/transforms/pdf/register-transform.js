/**
 * 
 * @param  {Object} eleventyConfig
 * @param  {String} output         epub, html, pdf
 * @param  {String} outputPath     Page output path where the transform should occur
 * @param  {String} id             ID attribute of the element to replace
 * @param  {String} content        Replacement content
 */
module.exports = function(eleventyConfig, output, outputPath, id, content) {
  eleventyConfig.transforms[outputPath] ??= {}
  eleventyConfig.transforms[outputPath][id] ??= {}
  eleventyConfig.transforms[outputPath][id][output] = content
}
