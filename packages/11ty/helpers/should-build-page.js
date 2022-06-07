/**
 * Returns true if page should be built
 * for the current output type defined in `env.OUTPUT`
 * @param  {Object} outputs Page frontmatter property `outputs`
 * @return {Boolean}
 */
module.exports = function (outputs) {
  return outputs !== 'none' 
    && outputs !== false 
    && (!outputs || Array.isArray(outputs) && outputs.includes(process.env.OUTPUT))
}
