/**
 * Adds a page-level transform to eleventyConfig.transforms
 * 
 * @param  {Object} eleventyConfig
 * @param  {String} output         epub, html, pdf
 * @param  {String} path     Page output path where the transform should occur
 * @param  {String} id             ID attribute of the element to replace
 * @param  {String} content        Replacement content
 */
module.exports = function(eleventyConfig, output, path, id, content) {
  eleventyConfig.transforms[path] ??= {}
  eleventyConfig.transforms[path][id] ??= {}
  eleventyConfig.transforms[path][id][output] = content
}
